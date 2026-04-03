import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

const sampleAnimals = [
  {
    name: "Барон",
    description: "Дуже дружелюбний та активний пес. Любить гуляти та гратися з м'ячиком. Чудово ладнає з дітьми та іншими тваринами.",
    type: "dog",
    breed: "Німецька вівчарка",
    sex: "male",
    age_months: 36,
    weight_kg: 32,
    size: "large",
    color: "Чорно-рудий",
    vaccinated: true,
    sterilized: true,
    trained: true,
    photos: JSON.stringify(["/uploads/dog1_1.jpg", "/uploads/dog1_2.jpg", "/uploads/dog1_3.jpg", "/uploads/dog1_4.jpg", "/uploads/dog1_5.jpg"]),
    contact_name: "Притулок ДніпроAnimals",
    contact_phone: "+38 (050) 100-00-01",
    contact_email: "shelter@dniproanimals.org",
    contact_location: "Дніпро, Лівий берег",
  },
  {
    name: "Мурка",
    description: "Спокійна та ласкава кішка. Обожнює лежати на колінах та муркотіти. Ідеальна для квартирного утримання.",
    type: "cat",
    breed: "Європейська короткошерста",
    sex: "female",
    age_months: 24,
    weight_kg: 4,
    size: "medium",
    color: "Сірий",
    vaccinated: true,
    sterilized: true,
    trained: false,
    photos: JSON.stringify(["/uploads/cat1_1.jpg", "/uploads/cat1_2.jpg", "/uploads/cat1_3.jpg", "/uploads/cat1_4.jpg", "/uploads/cat1_5.jpg"]),
    contact_name: "Притулок ДніпроAnimals",
    contact_phone: "+38 (050) 100-00-01",
    contact_email: "shelter@dniproanimals.org",
    contact_location: "Дніпро, вул. Героїв Дніпра",
  },
  {
    name: "Рекс",
    description: "Молодий та енергійний пес. Потребує активного господаря. Дуже розумний, швидко вчиться командам.",
    type: "dog",
    breed: "Лабрадор",
    sex: "male",
    age_months: 18,
    weight_kg: 28,
    size: "large",
    color: "Золотистий",
    vaccinated: true,
    sterilized: false,
    trained: true,
    photos: JSON.stringify(["/uploads/dog2_1.jpg", "/uploads/dog2_2.jpg", "/uploads/dog2_3.jpg", "/uploads/dog2_4.jpg"]),
    contact_name: "Притулок ДніпроAnimals",
    contact_phone: "+38 (050) 100-00-01",
    contact_email: "shelter@dniproanimals.org",
    contact_location: "Дніпро, Лівий берег",
  },
  {
    name: "Лапка",
    description: "Маленька грайлива кішечка. Любить бігати за іграшками та дряпати когтеточку. Привчена до лотка.",
    type: "cat",
    breed: "Мікс",
    sex: "female",
    age_months: 8,
    weight_kg: 2.5,
    size: "small",
    color: "Рудий",
    vaccinated: true,
    sterilized: false,
    trained: false,
    photos: JSON.stringify(["/uploads/cat2_1.jpg", "/uploads/cat2_2.jpg", "/uploads/cat2_3.jpg"]),
    contact_name: "Притулок ДніпроAnimals",
    contact_phone: "+38 (050) 100-00-01",
    contact_email: "shelter@dniproanimals.org",
    contact_location: "Дніпро, Центр",
  },
  {
    name: "Бім",
    description: "Вірний та відданий друг. Був знайдений на вулиці після обстрілу. Пройшов реабілітацію, тепер шукає люблячу родину.",
    type: "dog",
    breed: "Мікс",
    sex: "male",
    age_months: 48,
    weight_kg: 20,
    size: "medium",
    color: "Білий",
    vaccinated: true,
    sterilized: true,
    trained: false,
    photos: JSON.stringify(["/uploads/dog3_1.jpg", "/uploads/dog3_2.jpg", "/uploads/dog3_3.jpg", "/uploads/dog3_4.jpg"]),
    contact_name: "Притулок ДніпроAnimals",
    contact_phone: "+38 (050) 100-00-01",
    contact_email: "shelter@dniproanimals.org",
    contact_location: "Дніпро, Перемога",
  },
  {
    name: "Сніжинка",
    description: "Тиха та ніжна кішка білого кольору. Трохи сором'язлива спочатку, але потім стає дуже ласкавою.",
    type: "cat",
    breed: "Ангорська",
    sex: "female",
    age_months: 30,
    weight_kg: 3.5,
    size: "medium",
    color: "Білий",
    vaccinated: true,
    sterilized: true,
    trained: false,
    photos: JSON.stringify(["/uploads/cat3_1.jpg", "/uploads/cat3_2.jpg", "/uploads/cat3_3.jpg", "/uploads/cat3_4.jpg"]),
    contact_name: "Притулок ДніпроAnimals",
    contact_phone: "+38 (050) 100-00-01",
    contact_email: "shelter@dniproanimals.org",
    contact_location: "Дніпро, Центр",
  },
  {
    name: "Тайсон",
    description: "Сильний та мужній пес. Не дивлячись на грізний вигляд, дуже добрий та ласкавий. Потребує досвідченого господаря.",
    type: "dog",
    breed: "Стаффордширський тер'єр",
    sex: "male",
    age_months: 60,
    weight_kg: 35,
    size: "large",
    color: "Тигровий",
    vaccinated: true,
    sterilized: true,
    trained: true,
    photos: JSON.stringify(["/uploads/dog4_1.jpg", "/uploads/dog4_2.jpg", "/uploads/dog4_3.jpg"]),
    contact_name: "Притулок ДніпроAnimals",
    contact_phone: "+38 (050) 100-00-01",
    contact_email: "shelter@dniproanimals.org",
    contact_location: "Дніпро, Лівий берег",
  },
  {
    name: "Карамелька",
    description: "Маленька та чарівна собачка. Ідеальна для квартири. Дуже прив'язується до господаря.",
    type: "dog",
    breed: "Мікс (маленька)",
    sex: "female",
    age_months: 12,
    weight_kg: 5,
    size: "small",
    color: "Коричневий",
    vaccinated: true,
    sterilized: false,
    trained: false,
    photos: JSON.stringify(["/uploads/dog5_1.jpg", "/uploads/dog5_2.jpg", "/uploads/dog5_3.jpg", "/uploads/dog5_4.jpg"]),
    contact_name: "Олена",
    contact_phone: "+38 (099) 123-45-67",
    contact_instagram: "olena_pets",
    contact_location: "Дніпро, Центр",
  },
];

const sampleLostAnimals = [
  {
    title: "Загубився рудий кіт Рижик",
    description: "Зник 28 березня біля парку Шевченка. Рудий кіт, середній розмір, має нашийник синього кольору.",
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
    photos: JSON.stringify(["/uploads/cat2_1.jpg", "/uploads/cat2_2.jpg", "/uploads/cat2_3.jpg"]),
  },
  {
    title: "Пропала сіра кішка Муся",
    description: "Втекла з балкону 25 березня. Сіра короткошерста кішка, 3 роки, стерилізована. Має мікрочіп.",
    type: "lost",
    animal_type: "Кіт",
    breed: "Європейська короткошерста",
    sex: "female",
    color: "Сірий",
    size: "medium",
    location: "Дніпро, Лівий берег, вул. Калинова",
    last_seen_location: "Дніпро, вул. Калинова 78, біля підʼїзду",
    last_seen_date: "2026-03-25",
    contact_name: "Тетяна",
    contact_phone: "+38 (093) 777-88-99",
    photos: JSON.stringify(["/uploads/cat1_2.jpg", "/uploads/cat1_3.jpg", "/uploads/cat1_4.jpg"]),
  },
  {
    title: "Загубився білий пес Сніжок",
    description: "Зірвався з повідка під час прогулянки 30 березня. Білий пес середнього розміру, порода мікс.",
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
    photos: JSON.stringify(["/uploads/dog3_2.jpg", "/uploads/dog3_3.jpg", "/uploads/dog3_4.jpg"]),
  },
  {
    title: "Зникла маленька собачка Лола",
    description: "Маленька коричнева собачка, приблизно 2 роки. Зникла біля ТЦ Мост-Сіті.",
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
    photos: JSON.stringify(["/uploads/dog5_1.jpg", "/uploads/dog5_2.jpg", "/uploads/dog5_3.jpg", "/uploads/dog5_4.jpg"]),
  },
];

async function seed() {
  console.log("🌱 Seed started...\n");

  // 1. Users
  const { count: userCount } = await supabase.from("users").select("*", { count: "exact", head: true });
  let adminUser: { id: number } | null = null;
  let regularUser: { id: number } | null = null;

  if (!userCount || userCount === 0) {
    const { data: admin, error: adminErr } = await supabase
      .from("users")
      .insert({ name: "Admin", email: "admin@gmail.com", password: "admin", role: "superadmin" })
      .select("id")
      .single();
    if (adminErr) throw new Error(`Users: ${adminErr.message}`);
    adminUser = admin;

    const { data: user, error: userErr } = await supabase
      .from("users")
      .insert({ name: "Іван Петренко", email: "user@gmail.com", password: "user", role: "user" })
      .select("id")
      .single();
    if (userErr) throw new Error(`Users: ${userErr.message}`);
    regularUser = user;

    console.log("✅ Users: admin@gmail.com / admin, user@gmail.com / user");
  } else {
    const { data: a } = await supabase.from("users").select("id").eq("email", "admin@gmail.com").single();
    const { data: u } = await supabase.from("users").select("id").eq("email", "user@gmail.com").single();
    adminUser = a;
    regularUser = u;
    console.log(`⏭️  Users: already exist (${userCount})`);
  }

  // 2. Organization
  const { count: orgCount } = await supabase.from("organizations").select("*", { count: "exact", head: true });
  let orgId: number | null = null;

  if ((!orgCount || orgCount === 0) && adminUser) {
    const { data: org, error: orgErr } = await supabase
      .from("organizations")
      .insert({
        name: "Притулок ДніпроAnimals",
        description: "Міський притулок для безпритульних тварин у Дніпрі. Ми рятуємо, лікуємо та шукаємо новий дім для котиків і песиків.",
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
    await supabase.from("users").update({ role: "admin", org_id: orgId }).eq("id", adminUser.id);
    console.log(`✅ Organization: "Притулок ДніпроAnimals" (id: ${orgId})`);
  } else {
    const { data: existing } = await supabase.from("organizations").select("id").limit(1).single();
    orgId = existing?.id ?? null;
    console.log(`⏭️  Organizations: already exist (${orgCount})`);
  }

  // 3. Volunteers
  const { count: volCount } = await supabase.from("volunteers").select("*", { count: "exact", head: true });

  if ((!volCount || volCount === 0) && orgId) {
    const volunteersData = [
      { name: "Олена", surname: "Коваленко", phone: "+38 (067) 111-11-11", email: "olena@gmail.com", description: "Досвід роботи з собаками 5 років" },
      { name: "Максим", surname: "Шевченко", phone: "+38 (093) 222-22-22", email: "maxim@gmail.com", description: "Ветеринар-волонтер" },
      { name: "Анна", surname: "Бондаренко", phone: "+38 (095) 333-33-33", email: "anna@gmail.com", description: "Фотограф-волонтер, робить фото для оголошень" },
    ];

    for (const vol of volunteersData) {
      const invite_token = crypto.randomBytes(24).toString("hex");
      const { error } = await supabase.from("volunteers").insert({ org_id: orgId, ...vol, invite_token });
      if (error) throw new Error(`Volunteers: ${error.message}`);
    }
    console.log(`✅ Volunteers: ${volunteersData.length} created`);
  } else {
    console.log(`⏭️  Volunteers: already exist (${volCount})`);
  }

  // 4. Animals
  const { count: animalCount } = await supabase.from("animals").select("*", { count: "exact", head: true });

  if (!animalCount || animalCount === 0) {
    const animalsWithOrg = sampleAnimals.map((a) => ({ ...a, org_id: orgId }));
    const { error } = await supabase.from("animals").insert(animalsWithOrg);
    if (error) throw new Error(`Animals: ${error.message}`);
    console.log(`✅ Animals: ${sampleAnimals.length} created (org_id: ${orgId})`);
  } else {
    console.log(`⏭️  Animals: already exist (${animalCount})`);
  }

  // 5. Lost animals
  const { count: lostCount } = await supabase.from("lost_animals").select("*", { count: "exact", head: true });

  if (!lostCount || lostCount === 0) {
    const { error } = await supabase.from("lost_animals").insert(sampleLostAnimals);
    if (error) throw new Error(`Lost animals: ${error.message}`);
    console.log(`✅ Lost animals: ${sampleLostAnimals.length} created`);
  } else {
    console.log(`⏭️  Lost animals: already exist (${lostCount})`);
  }

  // 6. Adoption requests
  const { count: adoptionCount } = await supabase.from("adoption_requests").select("*", { count: "exact", head: true });

  if (!adoptionCount || adoptionCount === 0) {
    const { data: firstAnimals } = await supabase.from("animals").select("id").order("id", { ascending: true }).limit(2);

    if (firstAnimals && firstAnimals.length >= 2) {
      const { error } = await supabase.from("adoption_requests").insert([
        {
          animal_id: firstAnimals[0].id,
          name: "Марина Сидоренко",
          email: "marina@gmail.com",
          phone: "+38 (067) 999-88-77",
          message: "Дуже хочу забрати Барона! У мене приватний будинок з великим двором.",
          status: "pending",
        },
        {
          animal_id: firstAnimals[1].id,
          name: "Олег Кравченко",
          email: "oleg@gmail.com",
          phone: "+38 (050) 666-55-44",
          telegram: "oleg_k",
          message: "Шукаю кішку для квартири. Мурка ідеально підходить!",
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
    const { count: favCount } = await supabase.from("favorites").select("*", { count: "exact", head: true });

    if (!favCount || favCount === 0) {
      const { data: someAnimals } = await supabase.from("animals").select("id").order("id", { ascending: true }).limit(3);

      if (someAnimals && someAnimals.length > 0) {
        const { error } = await supabase.from("favorites").insert(
          someAnimals.map((a) => ({ user_id: regularUser!.id, animal_id: a.id }))
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
    const { count: notifCount } = await supabase.from("notifications").select("*", { count: "exact", head: true });

    if (!notifCount || notifCount === 0) {
      const { error } = await supabase.from("notifications").insert([
        { org_id: orgId, type: "adoption_request", title: "Нова заявка на усиновлення", message: "Марина хоче забрати Барона", link: "/dashboard/requests" },
        { org_id: orgId, type: "adoption_request", title: "Нова заявка на усиновлення", message: "Олег хоче забрати Мурку", link: "/dashboard/requests" },
        { org_id: orgId, type: "org_created", title: "Організацію схвалено", message: "Вашу організацію було успішно схвалено модератором" },
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
