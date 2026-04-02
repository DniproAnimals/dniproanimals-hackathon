import { NextResponse } from "next/server";
import getDb from "@/lib/db";

const sampleAnimals = [
  {
    name: "Барон",
    description:
      "Дуже дружелюбний та активний пес. Любить гуляти та гратися з м'ячиком. Чудово ладнає з дітьми та іншими тваринами.",
    type: "dog",
    breed: "Німецька вівчарка",
    sex: "male",
    age_months: 36,
    weight_kg: 32,
    size: "large",
    color: "Чорно-рудий",
    vaccinated: 1,
    sterilized: 1,
    trained: 1,
    photos: JSON.stringify([
      "/uploads/dog1_1.jpg",
      "/uploads/dog1_2.jpg",
      "/uploads/dog1_3.jpg",
      "/uploads/dog1_4.jpg",
      "/uploads/dog1_5.jpg",
    ]),
    contact_name: null,
    contact_phone: null,
    contact_instagram: null,
    contact_telegram: null,
    contact_facebook: null,
    contact_email: null,
    contact_location: "Дніпро, Лівий берег",
  },
  {
    name: "Мурка",
    description:
      "Спокійна та ласкава кішка. Обожнює лежати на колінах та муркотіти. Ідеальна для квартирного утримання.",
    type: "cat",
    breed: "Європейська короткошерста",
    sex: "female",
    age_months: 24,
    weight_kg: 4,
    size: "medium",
    color: "Сірий",
    vaccinated: 1,
    sterilized: 1,
    trained: 0,
    photos: JSON.stringify([
      "/uploads/cat1_1.jpg",
      "/uploads/cat1_2.jpg",
      "/uploads/cat1_3.jpg",
      "/uploads/cat1_4.jpg",
      "/uploads/cat1_5.jpg",
    ]),
    contact_name: "Інесса",
    contact_phone: "+38 (050) 111-22-33",
    contact_email: "inessa@dniproanimals.org",
    contact_instagram: "dniproanimals",
    contact_telegram: "itsmotherofcats",
    contact_facebook: "dniproanimals",
    contact_location: "Дніпро, вул. Героїв Дніпра",
  },
  {
    name: "Рекс",
    description:
      "Молодий та енергійний пес. Потребує активного господаря. Дуже розумний, швидко вчиться командам.",
    type: "dog",
    breed: "Лабрадор",
    sex: "male",
    age_months: 18,
    weight_kg: 28,
    size: "large",
    color: "Золотистий",
    vaccinated: 1,
    sterilized: 0,
    trained: 1,
    photos: JSON.stringify([
      "/uploads/dog2_1.jpg",
      "/uploads/dog2_2.jpg",
      "/uploads/dog2_3.jpg",
      "/uploads/dog2_4.jpg",
    ]),
  },
  {
    name: "Лапка",
    description:
      "Маленька грайлива кішечка. Любить бігати за іграшками та дряпати когтеточку. Привчена до лотка.",
    type: "cat",
    breed: "Мікс",
    sex: "female",
    age_months: 8,
    weight_kg: 2.5,
    size: "small",
    color: "Рудий",
    vaccinated: 1,
    sterilized: 0,
    trained: 0,
    photos: JSON.stringify([
      "/uploads/cat2_1.jpg",
      "/uploads/cat2_2.jpg",
      "/uploads/cat2_3.jpg",
    ]),
  },
  {
    name: "Бім",
    description:
      "Вірний та відданий друг. Був знайдений на вулиці після обстрілу. Пройшов реабілітацію, тепер шукає люблячу родину.",
    type: "dog",
    breed: "Мікс",
    sex: "male",
    age_months: 48,
    weight_kg: 20,
    size: "medium",
    color: "Білий",
    vaccinated: 1,
    sterilized: 1,
    trained: 0,
    photos: JSON.stringify([
      "/uploads/dog3_1.jpg",
      "/uploads/dog3_2.jpg",
      "/uploads/dog3_3.jpg",
      "/uploads/dog3_4.jpg",
    ]),
  },
  {
    name: "Сніжинка",
    description:
      "Тиха та ніжна кішка білого кольору. Трохи сором'язлива спочатку, але потім стає дуже ласкавою.",
    type: "cat",
    breed: "Ангорська",
    sex: "female",
    age_months: 30,
    weight_kg: 3.5,
    size: "medium",
    color: "Білий",
    vaccinated: 1,
    sterilized: 1,
    trained: 0,
    photos: JSON.stringify([
      "/uploads/cat3_1.jpg",
      "/uploads/cat3_2.jpg",
      "/uploads/cat3_3.jpg",
      "/uploads/cat3_4.jpg",
    ]),
  },
  {
    name: "Тайсон",
    description:
      "Сильний та мужній пес. Не дивлячись на грізний вигляд, дуже добрий та ласкавий. Потребує досвідченого господаря.",
    type: "dog",
    breed: "Стаффордширський тер'єр",
    sex: "male",
    age_months: 60,
    weight_kg: 35,
    size: "large",
    color: "Тигровий",
    vaccinated: 1,
    sterilized: 1,
    trained: 1,
    photos: JSON.stringify([
      "/uploads/dog4_1.jpg",
      "/uploads/dog4_2.jpg",
      "/uploads/dog4_3.jpg",
    ]),
  },
  {
    name: "Карамелька",
    description:
      "Маленька та чарівна собачка. Ідеальна для квартири. Дуже прив'язується до господаря.",
    type: "dog",
    breed: "Мікс (маленька)",
    sex: "female",
    age_months: 12,
    weight_kg: 5,
    size: "small",
    color: "Коричневий",
    vaccinated: 1,
    sterilized: 0,
    trained: 0,
    photos: JSON.stringify([
      "/uploads/dog5_1.jpg",
      "/uploads/dog5_2.jpg",
      "/uploads/dog5_3.jpg",
      "/uploads/dog5_4.jpg",
    ]),
    contact_name: "Олена",
    contact_phone: "+38 (099) 123-45-67",
    contact_instagram: "olena_pets",
    contact_location: "Дніпро, Центр",
  },
];

export async function POST() {
  const db = getDb();

  const count = db
    .prepare("SELECT COUNT(*) as cnt FROM animals")
    .get() as { cnt: number };
  if (count.cnt > 0) {
    return NextResponse.json({
      message: "База вже містить дані",
      count: count.cnt,
    });
  }

  const insert = db.prepare(
    `INSERT INTO animals (name, description, type, breed, sex, age_months, weight_kg, size, color, vaccinated, sterilized, trained, photos, contact_name, contact_phone, contact_email, contact_instagram, contact_telegram, contact_facebook, contact_location)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );

  const insertMany = db.transaction(() => {
    for (const a of sampleAnimals) {
      insert.run(
        a.name,
        a.description,
        a.type,
        a.breed,
        a.sex,
        a.age_months,
        a.weight_kg,
        a.size,
        a.color,
        a.vaccinated,
        a.sterilized,
        a.trained,
        a.photos,
        a.contact_name || null,
        a.contact_phone || null,
        a.contact_email || null,
        a.contact_instagram || null,
        a.contact_telegram || null,
        a.contact_facebook || null,
        a.contact_location || null,
      );
    }
  });

  insertMany();

  return NextResponse.json({
    message: `Додано ${sampleAnimals.length} тварин`,
    count: sampleAnimals.length,
  });
}
