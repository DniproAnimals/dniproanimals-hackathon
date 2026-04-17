import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import fs from "fs";
import path from "path";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

// --- Parse animals_database.json ---

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

function parseAge(ageStr: string): number {
  const years = parseInt(ageStr);
  return isNaN(years) ? 12 : years * 12;
}

function parseWeight(weightStr: string): number {
  return parseFloat(weightStr) || 5;
}

function mapType(type: string): string {
  if (type === "Кіт") return "cat";
  if (type === "Собака") return "dog";
  return "other";
}

function mapSex(sex: string): string {
  if (sex === "Хлопчик") return "male";
  if (sex === "Дівчинка") return "female";
  return "unknown";
}

function mapSize(size: string): string {
  if (size === "Великий") return "large";
  if (size === "Середній") return "medium";
  if (size === "Малий") return "small";
  return "medium";
}

function mapBool(val: string): boolean {
  return val === "Так";
}

function loadAnimals() {
  const jsonPath = path.resolve(__dirname, "../animals_database.json");
  const raw: RawAnimal[] = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

  let catIdx = 0;
  let dogIdx = 0;

  return raw.map((a) => {
    const type = mapType(a["Вид"]);
    let name: string;
    if (type === "cat") {
      name = catNames[catIdx % catNames.length];
      catIdx++;
    } else {
      name = dogNames[dogIdx % dogNames.length];
      dogIdx++;
    }

    return {
      name,
      type,
      breed: a["Порода"],
      sex: mapSex(a["Стать"]),
      age_months: parseAge(a["Вік"]),
      weight_kg: parseWeight(a["Вага"]),
      size: mapSize(a["Розмір"]),
      color: a["Колір"],
      vaccinated: mapBool(a["Вакцинація"]),
      sterilized: mapBool(a["Стерилізація"]),
      trained: mapBool(a["Навчено"]),
      photos: JSON.stringify(a.photos.map((p) => `/uploads/${p}`)),
      status: "available",
    };
  });
}

// --- Lost animals (demo) ---

const sampleLostAnimals = [
  {
    title: "Загубився рудий кіт Рижик",
    description:
      "Зник 28 березня біля парку Шевченка. Рудий кіт, середній розмір, має нашийник синього кольору.",
    type: "lost",
    animal_type: "Кіт",
    breed: "Мікс",
    sex: "male",
    color: "Рудий",
    size: "medium",
    location: "Дніпро, парк Шевченка",
    last_seen_location: "Дніпро, парк Шевченка, біля фонтану",
    last_seen_date: "2026-03-28",
    contact_name: "Марія",
    contact_phone: "+38 (067) 555-12-34",
    photos: JSON.stringify([]),
  },
  {
    title: "Пропала сіра кішка Муся",
    description:
      "Втекла з балкону 25 березня. Сіра короткошерста кішка, 3 роки, стерилізована. Має мікрочіп.",
    type: "lost",
    animal_type: "Кіт",
    breed: "Європейська короткошерста",
    sex: "female",
    color: "Сірий",
    size: "medium",
    location: "Дніпро, Лівий берег, вул. Калинова",
    last_seen_location: "Дніпро, вул. Калинова 78, біля під'їзду",
    last_seen_date: "2026-03-25",
    contact_name: "Тетяна",
    contact_phone: "+38 (093) 777-88-99",
    photos: JSON.stringify([]),
  },
  {
    title: "Загубився білий пес Сніжок",
    description:
      "Зірвався з повідка під час прогулянки 30 березня. Білий пес середнього розміру, порода мікс.",
    type: "lost",
    animal_type: "Собака",
    breed: "Мікс",
    sex: "male",
    color: "Білий",
    size: "medium",
    location: "Дніпро, Перемога, вул. Героїв",
    last_seen_location: "Дніпро, вул. Героїв 15, біля школи №45",
    last_seen_date: "2026-03-30",
    contact_name: "Андрій",
    contact_phone: "+38 (095) 111-22-33",
    photos: JSON.stringify([]),
  },
  {
    title: "Зникла маленька собачка Лола",
    description:
      "Маленька коричнева собачка, приблизно 2 роки. Зникла біля ТЦ Мост-Сіті.",
    type: "lost",
    animal_type: "Собака",
    breed: "Чихуахуа",
    sex: "female",
    color: "Коричневий",
    size: "small",
    location: "Дніпро, ТЦ Мост-Сіті",
    last_seen_location: "Дніпро, ТЦ Мост-Сіті, парковка",
    last_seen_date: "2026-03-31",
    contact_name: "Ольга",
    contact_phone: "+38 (066) 444-55-66",
    photos: JSON.stringify([]),
  },
];

// --- Seed ---

async function seed() {
  console.log("🌱 Seed started...\n");

  // 1. Users
  const { count: userCount } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true });
  let adminUser: { id: number } | null = null;
  let regularUser: { id: number } | null = null;

  if (!userCount || userCount === 0) {
    const { data: admin, error: adminErr } = await supabase
      .from("users")
      .insert({
        name: "Admin",
        email: "admin@gmail.com",
        password: "admin",
        role: "superadmin",
      })
      .select("id")
      .single();
    if (adminErr) throw new Error(`Users: ${adminErr.message}`);
    adminUser = admin;

    const { data: user, error: userErr } = await supabase
      .from("users")
      .insert({
        name: "Іван Петренко",
        email: "user@gmail.com",
        password: "user",
        role: "user",
      })
      .select("id")
      .single();
    if (userErr) throw new Error(`Users: ${userErr.message}`);
    regularUser = user;

    console.log("✅ Users: admin@gmail.com / admin, user@gmail.com / user");
  } else {
    const { data: a } = await supabase
      .from("users")
      .select("id")
      .eq("email", "admin@gmail.com")
      .single();
    const { data: u } = await supabase
      .from("users")
      .select("id")
      .eq("email", "user@gmail.com")
      .single();
    adminUser = a;
    regularUser = u;
    console.log(`⏭️  Users: already exist (${userCount})`);
  }

  // 2. Organization
  const { count: orgCount } = await supabase
    .from("organizations")
    .select("*", { count: "exact", head: true });
  let orgId: number | null = null;

  if ((!orgCount || orgCount === 0) && adminUser) {
    const { data: org, error: orgErr } = await supabase
      .from("organizations")
      .insert({
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
        owner_id: adminUser.id,
        status: "approved",
      })
      .select("id")
      .single();
    if (orgErr) throw new Error(`Organizations: ${orgErr.message}`);

    orgId = org!.id;
    await supabase
      .from("users")
      .update({ role: "admin", org_id: orgId })
      .eq("id", adminUser.id);
    console.log(`✅ Organization: "Притулок ДніпроAnimals" (id: ${orgId})`);
  } else {
    const { data: existing } = await supabase
      .from("organizations")
      .select("id")
      .limit(1)
      .single();
    orgId = existing?.id ?? null;
    console.log(`⏭️  Organizations: already exist (${orgCount})`);
  }

  // 3. Volunteers
  const { count: volCount } = await supabase
    .from("volunteers")
    .select("*", { count: "exact", head: true });

  if ((!volCount || volCount === 0) && orgId) {
    const volunteersData = [
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
        description: "Фотограф-волонтер, робить фото для оголошень",
      },
    ];

    for (const vol of volunteersData) {
      const invite_token = crypto.randomBytes(24).toString("hex");
      const { error } = await supabase
        .from("volunteers")
        .insert({ org_id: orgId, ...vol, invite_token });
      if (error) throw new Error(`Volunteers: ${error.message}`);
    }
    console.log(`✅ Volunteers: ${volunteersData.length} created`);
  } else {
    console.log(`⏭️  Volunteers: already exist (${volCount})`);
  }

  // 4. Animals from animals_database.json
  const { count: animalCount } = await supabase
    .from("animals")
    .select("*", { count: "exact", head: true });

  if (!animalCount || animalCount === 0) {
    const animals = loadAnimals().map((a) => ({ ...a, org_id: orgId }));
    const { error } = await supabase.from("animals").insert(animals);
    if (error) throw new Error(`Animals: ${error.message}`);
    console.log(
      `✅ Animals: ${animals.length} created from animals_database.json (org_id: ${orgId})`,
    );
  } else {
    console.log(`⏭️  Animals: already exist (${animalCount})`);
  }

  // 5. Lost animals
  const { count: lostCount } = await supabase
    .from("lost_animals")
    .select("*", { count: "exact", head: true });

  if (!lostCount || lostCount === 0) {
    const { error } = await supabase
      .from("lost_animals")
      .insert(sampleLostAnimals);
    if (error) throw new Error(`Lost animals: ${error.message}`);
    console.log(`✅ Lost animals: ${sampleLostAnimals.length} created`);
  } else {
    console.log(`⏭️  Lost animals: already exist (${lostCount})`);
  }

  // 6. Adoption requests
  const { count: adoptionCount } = await supabase
    .from("adoption_requests")
    .select("*", { count: "exact", head: true });

  if (!adoptionCount || adoptionCount === 0) {
    const { data: firstAnimals } = await supabase
      .from("animals")
      .select("id")
      .order("id", { ascending: true })
      .limit(2);

    if (firstAnimals && firstAnimals.length >= 2) {
      const { error } = await supabase.from("adoption_requests").insert([
        {
          animal_id: firstAnimals[0].id,
          name: "Марина Сидоренко",
          email: "marina@gmail.com",
          phone: "+38 (067) 999-88-77",
          message:
            "Дуже хочу забрати цю тваринку! У мене приватний будинок з великим двором.",
          status: "pending",
        },
        {
          animal_id: firstAnimals[1].id,
          name: "Олег Кравченко",
          email: "oleg@gmail.com",
          phone: "+38 (050) 666-55-44",
          telegram: "oleg_k",
          message: "Шукаю котика для квартири. Ідеально підходить!",
          status: "pending",
        },
      ]);
      if (error) throw new Error(`Adoption requests: ${error.message}`);
      console.log("✅ Adoption requests: 2 created");
    }
  } else {
    console.log(`⏭️  Adoption requests: already exist (${adoptionCount})`);
  }

  // 7. Favorites
  if (regularUser) {
    const { count: favCount } = await supabase
      .from("favorites")
      .select("*", { count: "exact", head: true });

    if (!favCount || favCount === 0) {
      const { data: someAnimals } = await supabase
        .from("animals")
        .select("id")
        .order("id", { ascending: true })
        .limit(3);

      if (someAnimals && someAnimals.length > 0) {
        const { error } = await supabase.from("favorites").insert(
          someAnimals.map((a) => ({
            user_id: regularUser!.id,
            animal_id: a.id,
          })),
        );
        if (error) throw new Error(`Favorites: ${error.message}`);
        console.log(`✅ Favorites: ${someAnimals.length} created for user`);
      }
    } else {
      console.log(`⏭️  Favorites: already exist (${favCount})`);
    }
  }

  // 8. Notifications
  if (orgId) {
    const { count: notifCount } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true });

    if (!notifCount || notifCount === 0) {
      const { error } = await supabase.from("notifications").insert([
        {
          org_id: orgId,
          type: "adoption_request",
          title: "Нова заявка на усиновлення",
          message: "Марина хоче забрати тваринку",
          link: "/dashboard/requests",
        },
        {
          org_id: orgId,
          type: "adoption_request",
          title: "Нова заявка на усиновлення",
          message: "Олег хоче забрати котика",
          link: "/dashboard/requests",
        },
        {
          org_id: orgId,
          type: "org_created",
          title: "Організацію схвалено",
          message: "Вашу організацію було успішно схвалено модератором",
        },
      ]);
      if (error) throw new Error(`Notifications: ${error.message}`);
      console.log("✅ Notifications: 3 created");
    } else {
      console.log(`⏭️  Notifications: already exist (${notifCount})`);
    }
  }

  console.log("\n🎉 Seed completed!");
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});
