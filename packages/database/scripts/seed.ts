import "@dniproanimals/env/load";
import bcrypt from "bcryptjs";
import { eq, sql } from "drizzle-orm";
import { AnyPgTable } from "drizzle-orm/pg-core";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { db } from "../src";
import {
  adoptionRequestsTable,
  animalsTable,
  favoritesTable,
  lostAnimalsTable,
  notificationsTable,
  organizationsTable,
  usersTable,
  volunteersTable,
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

function loadAnimals(orgId: number) {
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
      orgId,
    };
  });
}

const sampleLost = [
  {
    title: "Загубився рудий кіт Рижик",
    description:
      "Зник 28 березня біля парку Шевченка. Рудий кіт, середній розмір, має нашийник синього кольору.",
    type: "lost" as const,
    animalType: "Кіт",
    breed: "Мікс",
    sex: "male",
    color: "Рудий",
    size: "medium",
    location: "Дніпро, парк Шевченка",
    lastSeenLocation: "Дніпро, парк Шевченка, біля фонтану",
    lastSeenDate: "2026-03-28",
    contactName: "Марія",
    contactPhone: "+38 (067) 555-12-34",
    photos: JSON.stringify([]),
  },
  {
    title: "Пропала сіра кішка Муся",
    description:
      "Втекла з балкону 25 березня. Сіра короткошерста кішка, 3 роки, стерилізована. Має мікрочіп.",
    type: "lost" as const,
    animalType: "Кіт",
    breed: "Європейська короткошерста",
    sex: "female",
    color: "Сірий",
    size: "medium",
    location: "Дніпро, Лівий берег, вул. Калинова",
    lastSeenLocation: "Дніпро, вул. Калинова 78, біля під'їзду",
    lastSeenDate: "2026-03-25",
    contactName: "Тетяна",
    contactPhone: "+38 (093) 777-88-99",
    photos: JSON.stringify([]),
  },
  {
    title: "Загубився білий пес Сніжок",
    description:
      "Зірвався з повідка під час прогулянки 30 березня. Білий пес середнього розміру, порода мікс.",
    type: "lost" as const,
    animalType: "Собака",
    breed: "Мікс",
    sex: "male",
    color: "Білий",
    size: "medium",
    location: "Дніпро, Перемога, вул. Героїв",
    lastSeenLocation: "Дніпро, вул. Героїв 15, біля школи №45",
    lastSeenDate: "2026-03-30",
    contactName: "Андрій",
    contactPhone: "+38 (095) 111-22-33",
    photos: JSON.stringify([]),
  },
  {
    title: "Зникла маленька собачка Лола",
    description:
      "Маленька коричнева собачка, приблизно 2 роки. Зникла біля ТЦ Мост-Сіті.",
    type: "lost" as const,
    animalType: "Собака",
    breed: "Чихуахуа",
    sex: "female",
    color: "Коричневий",
    size: "small",
    location: "Дніпро, ТЦ Мост-Сіті",
    lastSeenLocation: "Дніпро, ТЦ Мост-Сіті, парковка",
    lastSeenDate: "2026-03-31",
    contactName: "Ольга",
    contactPhone: "+38 (066) 444-55-66",
    photos: JSON.stringify([]),
  },
];
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
    adminUserId = admin!.id;

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
    const [admin] = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.email, "admin@gmail.com"));
    const [user] = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.email, "user@gmail.com"));
    adminUserId = admin?.id ?? null;
    regularUserId = user?.id ?? null;
    console.log(`Users: already exist (${userCount})`);
  }

  const orgCount = await getCount(organizationsTable);
  let orgId: number | null = null;

  if (orgCount === 0 && adminUserId) {
    const [org] = await db
      .insert(organizationsTable)
      .values({
        name: "Притулок ДніпроAnimals",
        description:
          "Міський притулок для безпритульних тварин у Дніпрі. Ми рятуємо, лікуємо та шукаємо новий дім для котиків і песиків.",
        location: "Дніпро, вул. Набережна Перемоги 50",
        phone: "+38 (050) 100-00-01",
        email: "shelter@dniproanimals.org",
        instagram: "dniproanimals",
        telegram: "dniproanimals_bot",
        facebook: "dniproanimals",
        website: "https://dniproanimals.org",
        ownerId: adminUserId,
        status: "approved",
      })
      .returning({ id: organizationsTable.id });
    orgId = org!.id;

    await db
      .update(usersTable)
      .set({ role: "admin", orgId })
      .where(eq(usersTable.id, adminUserId));
    console.log(`Organization: id=${orgId}`);
  } else {
    const [existing] = await db
      .select({ id: organizationsTable.id })
      .from(organizationsTable)
      .limit(1);
    orgId = existing?.id ?? null;
    console.log(`Organizations: already exist (${orgCount})`);
  }

  if (orgId) {
    const volCount = await getCount(volunteersTable);

    if (volCount === 0) {
      const data = [
        {
          name: "Олена",
          surname: "Коваленко",
          phone: "+38 (067) 111-11-11",
          email: "olena@gmail.com",
          description: "Досвід роботи з собаками 5 років",
        },
        {
          name: "Максим",
          surname: "Шевченко",
          phone: "+38 (093) 222-22-22",
          email: "maxim@gmail.com",
          description: "Ветеринар-волонтер",
        },
        {
          name: "Анна",
          surname: "Бондаренко",
          phone: "+38 (095) 333-33-33",
          email: "anna@gmail.com",
          description: "Фотограф-волонтер",
        },
      ];
      for (const v of data) {
        await db.insert(volunteersTable).values({
          orgId,
          ...v,
          inviteToken: crypto.randomBytes(24).toString("hex"),
        });
      }
      console.log(`Volunteers: ${data.length} created`);
    } else {
      console.log(`Volunteers: already exist (${volCount})`);
    }
  }

  if (orgId) {
    const animalCount = await getCount(animalsTable);

    if (animalCount === 0) {
      const animals = loadAnimals(orgId);
      await db.insert(animalsTable).values(animals);
      console.log(`Animals: ${animals.length} created`);
    } else {
      console.log(`Animals: already exist (${animalCount})`);
    }
  }

  const lostCount = await getCount(lostAnimalsTable);

  if (lostCount === 0) {
    await db.insert(lostAnimalsTable).values(sampleLost);
    console.log(`Lost animals: ${sampleLost.length} created`);
  } else {
    console.log(`Lost animals: already exist (${lostCount})`);
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

  if (orgId) {
    const notifCount = await getCount(notificationsTable);

    if (notifCount === 0) {
      await db.insert(notificationsTable).values([
        {
          orgId,
          type: "adoption_request",
          title: "Нова заявка на усиновлення",
          message: "Марина хоче забрати тваринку",
          link: "/dashboard/requests",
        },
        {
          orgId,
          type: "adoption_request",
          title: "Нова заявка на усиновлення",
          message: "Олег хоче забрати котика",
          link: "/dashboard/requests",
        },
        {
          orgId,
          type: "org_created",
          title: "Організацію схвалено",
          message: "Вашу організацію було успішно схвалено модератором",
          link: null,
        },
      ]);
      console.log("Notifications: 3 created");
    } else {
      console.log(`Notifications: already exist (${notifCount})`);
    }
  }

  console.log("\nSeed completed!");
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
