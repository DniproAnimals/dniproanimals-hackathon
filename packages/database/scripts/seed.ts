import { contractTemplates } from "@dniproanimals/database";
import "@dniproanimals/env/load";
import bcrypt from "bcryptjs";
import { eq, sql } from "drizzle-orm";
import { AnyPgTable } from "drizzle-orm/pg-core";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { db } from "../src";
import {
  adoptionRequestsTable,
  animalsTable,
  favoritesTable,
  notificationsTable,
  usersTable,
} from "../src/db/schema";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface RawAnimal {
  Вид: string;
  Порода: string;
  Стать: string;
  Вік: string;
  Розмір: string;
  Вага: string;
  Колір: string;
  Вакцинація: string;
  Стерилізація: string;
  Навчено: string;
  photos: string[];
  id: string;
}

const catNames = [
  "Мурка",
  "Сніжинка",
  "Лапка",
  "Карамелька",
  "Зірка",
  "Баська",
  "Рижик",
  "Персик",
  "Ніжка",
  "Клео",
  "Соня",
  "Симба",
  "Маруся",
  "Тіша",
  "Мілка",
];
const dogNames = [
  "Барон",
  "Рекс",
  "Бім",
  "Тайсон",
  "Джек",
  "Граф",
  "Лорд",
  "Буся",
  "Ліра",
  "Дейзі",
  "Бадді",
  "Чарлі",
  "Мухтар",
  "Шарік",
  "Найда",
];

const parseAge = (s: string) => (isNaN(parseInt(s)) ? 12 : parseInt(s) * 12);
const parseWeight = (s: string) => parseFloat(s) || 5;
const mapType = (t: string): "cat" | "dog" | "other" =>
  t === "Кіт" ? "cat" : t === "Собака" ? "dog" : "other";
const mapSex = (s: string) =>
  s === "Хлопчик" ? "male" : s === "Дівчинка" ? "female" : null;
const mapSize = (s: string) =>
  s === "Великий"
    ? "large"
    : s === "Середній"
      ? "medium"
      : s === "Малий"
        ? "small"
        : "medium";
const mapBool = (v: string) => v === "Так";

function loadAnimals() {
  const jsonPath = path.resolve(__dirname, "../data/animals_database.json");
  const raw: RawAnimal[] = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
  let catIdx = 0;
  let dogIdx = 0;

  return raw.map((a) => {
    const type = mapType(a["Вид"]);
    const name =
      type === "cat"
        ? catNames[catIdx++ % catNames.length]!
        : dogNames[dogIdx++ % dogNames.length]!;

    return {
      name,
      type,
      breed: a["Порода"] || null,
      sex: mapSex(a["Стать"]) as "male" | "female" | null,
      ageMonths: parseAge(a["Вік"]),
      weightKg: parseWeight(a["Вага"]),
      size: mapSize(a["Розмір"]) as "small" | "medium" | "large",
      color: a["Колір"] || null,
      vaccinated: mapBool(a["Вакцинація"]),
      sterilized: mapBool(a["Стерилізація"]),
      trained: mapBool(a["Навчено"]),
      photos: JSON.stringify(a.photos.map((p) => `/uploads/${p}`)),
      status: "available" as const,
    };
  });
}

export async function getCount(table: AnyPgTable) {
  const result = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(table);

  return result[0]?.count ?? 0;
}

async function seed() {
  console.log("Seed started...\n");

  const userCount = await getCount(usersTable);

  let adminUserId: number | null = null;
  let regularUserId: number | null = null;

  if (userCount === 0) {
    const [admin] = await db
      .insert(usersTable)
      .values({
        name: "Admin",
        email: "admin@gmail.com",
        passwordHash: await bcrypt.hash("admin", 10),
        role: "superadmin",
      })
      .returning({ id: usersTable.id });

    const [user] = await db
      .insert(usersTable)
      .values({
        name: "Іван Петренко",
        email: "user@gmail.com",
        passwordHash: await bcrypt.hash("user", 10),
        role: "user",
      })
      .returning({ id: usersTable.id });
    regularUserId = user!.id;

    console.log("Users: admin@gmail.com / admin, user@gmail.com / user");
  } else {
    const [] = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.email, "admin@gmail.com"));
    const [user] = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.email, "user@gmail.com"));
    // adminUserId = admin?.id ?? null;
    regularUserId = user?.id ?? null;
    console.log(`Users: already exist (${userCount})`);
  }

  const animalCount = await getCount(animalsTable);

  if (animalCount === 0) {
    const animals = loadAnimals();
    await db.insert(animalsTable).values(animals);
    console.log(`Animals: ${animals.length} created`);
  } else {
    console.log(`Animals: already exist (${animalCount})`);
  }

  const adoptionCount = await getCount(adoptionRequestsTable);

  if (adoptionCount === 0) {
    const firstAnimals = await db
      .select({ id: animalsTable.id })
      .from(animalsTable)
      .orderBy(animalsTable.id)
      .limit(2);

    if (firstAnimals.length >= 2) {
      await db.insert(adoptionRequestsTable).values([
        {
          animalId: firstAnimals[0]!.id,
          name: "Марина Сидоренко",
          email: "marina@gmail.com",
          phone: "+38 (067) 999-88-77",
          message:
            "Дуже хочу забрати цю тваринку! У мене приватний будинок з великим двором.",
          status: "pending",
        },
        {
          animalId: firstAnimals[1]!.id,
          name: "Олег Кравченко",
          email: "oleg@gmail.com",
          phone: "+38 (050) 666-55-44",
          telegram: "oleg_k",
          message: "Шукаю котика для квартири. Ідеально підходить!",
          status: "pending",
        },
      ]);
      console.log("Adoption requests: 2 created");
    }
  } else {
    console.log(`Adoption requests: already exist (${adoptionCount})`);
  }

  if (regularUserId) {
    const favCount = await getCount(favoritesTable);

    if (favCount === 0) {
      const some = await db
        .select({ id: animalsTable.id })
        .from(animalsTable)
        .orderBy(animalsTable.id)
        .limit(3);
      if (some.length > 0) {
        await db
          .insert(favoritesTable)
          .values(
            some.map((a) => ({ userId: regularUserId!, animalId: a.id })),
          );
        console.log(`Favorites: ${some.length} created`);
      }
    } else {
      console.log(`Favorites: already exist (${favCount})`);
    }
  }

  const notifCount = await getCount(notificationsTable);

  if (notifCount === 0) {
    await db.insert(notificationsTable).values([
      {
        type: "adoption_request",
        title: "Нова заявка на усиновлення",
        message: "Марина хоче забрати тваринку",
        link: "/dashboard/requests",
      },
      {
        type: "adoption_request",
        title: "Нова заявка на усиновлення",
        message: "Олег хоче забрати котика",
        link: "/dashboard/requests",
      },
    ]);
    console.log("Notifications: 2 created");
  } else {
    console.log(`Notifications: already exist (${notifCount})`);
  }
  const contractCount = await getCount(contractTemplates);

  if (contractCount === 0) {
    await db.insert(contractTemplates).values({
      type: "adoption",
      title: "Договір про передачу тварини в нову сім'ю (зразок)",
      subtitle:
        "Цей документ є демонстраційним зразком для платформи DniproAnimals. Юридичну силу має лише підписаний оригінал між сторонами.",

      content: {
        type: "doc",
        content: [
          {
            type: "heading",
            attrs: {
              level: 1,
            },
            content: [
              {
                type: "text",
                text: "Договір про передачу тварини в нову сім'ю",
              },
            ],
          },

          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Цей документ є демонстраційним зразком для платформи DniproAnimals. Юридичну силу має лише підписаний оригінал між сторонами.",
              },
            ],
          },

          {
            type: "heading",
            attrs: {
              level: 2,
            },
            content: [
              {
                type: "text",
                text: "1. Предмет договору",
              },
            ],
          },

          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Притулок передає, а Нова сім'я приймає тварину (далі — «Тварина») на умовах відповідального утримання та догляду.",
              },
            ],
          },

          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Передача Тварини здійснюється безоплатно як акт милосердя та відповідальної опіки.",
              },
            ],
          },

          {
            type: "heading",
            attrs: {
              level: 2,
            },
            content: [
              {
                type: "text",
                text: "2. Права та обов'язки Нової сім'ї",
              },
            ],
          },

          {
            type: "bulletList",
            content: [
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        text: "Забезпечити належний догляд, ветеринарний нагляд та харчування.",
                      },
                    ],
                  },
                ],
              },
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        text: "Не передавати тварину третім особам без письмової згоди притулку.",
                      },
                    ],
                  },
                ],
              },
            ],
          },

          {
            type: "heading",
            attrs: {
              level: 2,
            },
            content: [
              {
                type: "text",
                text: "3. Заключні положення",
              },
            ],
          },

          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Договір набирає чинності після його підписання сторонами.",
              },
            ],
          },
        ],
      },

      version: 1,
    });
    console.log("Contract template created");
  } else {
    console.log(`Contract template already exists (${contractCount})`);
  }
  console.log("\nSeed completed!");
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
