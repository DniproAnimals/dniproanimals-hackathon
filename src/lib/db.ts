import Database from "better-sqlite3";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "dniproanimals.db");

let db: Database.Database;

function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    initSchema(db);
    seedIfEmpty(db);
  }
  return db;
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS animals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      type TEXT NOT NULL CHECK(type IN ('dog', 'cat', 'other')),
      breed TEXT,
      sex TEXT CHECK(sex IN ('male', 'female')),
      age_months INTEGER,
      weight_kg REAL,
      size TEXT CHECK(size IN ('small', 'medium', 'large')),
      color TEXT,
      vaccinated INTEGER DEFAULT 0,
      sterilized INTEGER DEFAULT 0,
      trained INTEGER DEFAULT 0,
      commands TEXT DEFAULT '[]',
      photos TEXT DEFAULT '[]',
      contact_name TEXT,
      contact_phone TEXT,
      contact_email TEXT,
      contact_instagram TEXT,
      contact_telegram TEXT,
      contact_facebook TEXT,
      contact_location TEXT,
      status TEXT DEFAULT 'available' CHECK(status IN ('available', 'adopted', 'reserved')),
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS adoption_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      animal_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      instagram TEXT,
      telegram TEXT,
      facebook TEXT,
      location TEXT,
      message TEXT,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (animal_id) REFERENCES animals(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS lost_animals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('lost', 'found')),
      animal_type TEXT,
      breed TEXT,
      sex TEXT,
      color TEXT,
      size TEXT,
      location TEXT,
      last_seen_location TEXT,
      last_seen_date TEXT,
      contact_name TEXT NOT NULL,
      contact_phone TEXT NOT NULL,
      photos TEXT DEFAULT '[]',
      resolved INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user' CHECK(role IN ('user', 'admin', 'volunteer', 'superadmin')),
      photo TEXT,
      description TEXT,
      phone TEXT,
      instagram TEXT,
      telegram TEXT,
      facebook TEXT,
      org_id INTEGER,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS organizations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      photo TEXT,
      location TEXT,
      phone TEXT,
      email TEXT,
      instagram TEXT,
      telegram TEXT,
      facebook TEXT,
      website TEXT,
      owner_id INTEGER NOT NULL,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS volunteers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      org_id INTEGER NOT NULL,
      user_id INTEGER,
      name TEXT NOT NULL,
      surname TEXT,
      photo TEXT,
      description TEXT,
      phone TEXT,
      email TEXT,
      instagram TEXT,
      telegram TEXT,
      invite_token TEXT UNIQUE,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      org_id INTEGER,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT,
      link TEXT,
      is_read INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      animal_id INTEGER NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (animal_id) REFERENCES animals(id) ON DELETE CASCADE,
      UNIQUE(user_id, animal_id)
    );
  `);
}

function seedIfEmpty(db: Database.Database) {
  const count = db.prepare("SELECT COUNT(*) as cnt FROM animals").get() as { cnt: number };
  if (count.cnt > 0) return;

  // Don't seed if users already exist (someone registered before demo data was needed)
  const userCount = db.prepare("SELECT COUNT(*) as cnt FROM users").get() as { cnt: number };
  if (userCount.cnt > 0) return;

  const sampleAnimals = [
    { name: "Барон", description: "Дуже дружелюбний та активний пес. Любить гуляти та гратися з м'ячиком. Чудово ладнає з дітьми та іншими тваринами.", type: "dog", breed: "Німецька вівчарка", sex: "male", age_months: 36, weight_kg: 32, size: "large", color: "Чорно-рудий", vaccinated: 1, sterilized: 1, trained: 1, photos: JSON.stringify(["/uploads/dog1_1.jpg","/uploads/dog1_2.jpg","/uploads/dog1_3.jpg","/uploads/dog1_4.jpg","/uploads/dog1_5.jpg"]), contact_name: null, contact_phone: null, contact_email: null, contact_instagram: null, contact_telegram: null, contact_facebook: null, contact_location: "Дніпро, Лівий берег" },
    { name: "Мурка", description: "Спокійна та ласкава кішка. Обожнює лежати на колінах та муркотіти. Ідеальна для квартирного утримання.", type: "cat", breed: "Європейська короткошерста", sex: "female", age_months: 24, weight_kg: 4, size: "medium", color: "Сірий", vaccinated: 1, sterilized: 1, trained: 0, photos: JSON.stringify(["/uploads/cat1_1.jpg","/uploads/cat1_2.jpg","/uploads/cat1_3.jpg","/uploads/cat1_4.jpg","/uploads/cat1_5.jpg"]), contact_name: "Інесса", contact_phone: "+38 (050) 111-22-33", contact_email: "inessa@dniproanimals.org", contact_instagram: "dniproanimals", contact_telegram: "itsmotherofcats", contact_facebook: "dniproanimals", contact_location: "Дніпро, вул. Героїв Дніпра" },
    { name: "Рекс", description: "Молодий та енергійний пес. Потребує активного господаря. Дуже розумний, швидко вчиться командам.", type: "dog", breed: "Лабрадор", sex: "male", age_months: 18, weight_kg: 28, size: "large", color: "Золотистий", vaccinated: 1, sterilized: 0, trained: 1, photos: JSON.stringify(["/uploads/dog2_1.jpg","/uploads/dog2_2.jpg","/uploads/dog2_3.jpg","/uploads/dog2_4.jpg"]), contact_name: null, contact_phone: null, contact_email: null, contact_instagram: null, contact_telegram: null, contact_facebook: null, contact_location: null },
    { name: "Лапка", description: "Маленька грайлива кішечка. Любить бігати за іграшками та дряпати когтеточку. Привчена до лотка.", type: "cat", breed: "Мікс", sex: "female", age_months: 8, weight_kg: 2.5, size: "small", color: "Рудий", vaccinated: 1, sterilized: 0, trained: 0, photos: JSON.stringify(["/uploads/cat2_1.jpg","/uploads/cat2_2.jpg","/uploads/cat2_3.jpg"]), contact_name: null, contact_phone: null, contact_email: null, contact_instagram: null, contact_telegram: null, contact_facebook: null, contact_location: null },
    { name: "Бім", description: "Вірний та відданий друг. Був знайдений на вулиці після обстрілу. Пройшов реабілітацію, тепер шукає люблячу родину.", type: "dog", breed: "Мікс", sex: "male", age_months: 48, weight_kg: 20, size: "medium", color: "Білий", vaccinated: 1, sterilized: 1, trained: 0, photos: JSON.stringify(["/uploads/dog3_1.jpg","/uploads/dog3_2.jpg","/uploads/dog3_3.jpg","/uploads/dog3_4.jpg"]), contact_name: null, contact_phone: null, contact_email: null, contact_instagram: null, contact_telegram: null, contact_facebook: null, contact_location: null },
    { name: "Сніжинка", description: "Тиха та ніжна кішка білого кольору. Трохи сором'язлива спочатку, але потім стає дуже ласкавою.", type: "cat", breed: "Ангорська", sex: "female", age_months: 30, weight_kg: 3.5, size: "medium", color: "Білий", vaccinated: 1, sterilized: 1, trained: 0, photos: JSON.stringify(["/uploads/cat3_1.jpg","/uploads/cat3_2.jpg","/uploads/cat3_3.jpg","/uploads/cat3_4.jpg"]), contact_name: null, contact_phone: null, contact_email: null, contact_instagram: null, contact_telegram: null, contact_facebook: null, contact_location: null },
    { name: "Тайсон", description: "Сильний та мужній пес. Не дивлячись на грізний вигляд, дуже добрий та ласкавий. Потребує досвідченого господаря.", type: "dog", breed: "Стаффордширський тер'єр", sex: "male", age_months: 60, weight_kg: 35, size: "large", color: "Тигровий", vaccinated: 1, sterilized: 1, trained: 1, photos: JSON.stringify(["/uploads/dog4_1.jpg","/uploads/dog4_2.jpg","/uploads/dog4_3.jpg"]), contact_name: null, contact_phone: null, contact_email: null, contact_instagram: null, contact_telegram: null, contact_facebook: null, contact_location: null },
    { name: "Карамелька", description: "Маленька та чарівна собачка. Ідеальна для квартири. Дуже прив'язується до господаря.", type: "dog", breed: "Мікс (маленька)", sex: "female", age_months: 12, weight_kg: 5, size: "small", color: "Коричневий", vaccinated: 1, sterilized: 0, trained: 0, photos: JSON.stringify(["/uploads/dog5_1.jpg","/uploads/dog5_2.jpg","/uploads/dog5_3.jpg","/uploads/dog5_4.jpg"]), contact_name: "Олена", contact_phone: "+38 (099) 123-45-67", contact_email: null, contact_instagram: "olena_pets", contact_telegram: null, contact_facebook: null, contact_location: "Дніпро, Центр" },
  ];

  const insertAnimal = db.prepare(
    `INSERT INTO animals (name, description, type, breed, sex, age_months, weight_kg, size, color, vaccinated, sterilized, trained, photos, contact_name, contact_phone, contact_email, contact_instagram, contact_telegram, contact_facebook, contact_location)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );

  const sampleLost = [
    { title: "Загубився рудий кіт Рижик", description: "Зник 28 березня біля парку Шевченка. Рудий кіт, середній розмір, має нашийник синього кольору.", type: "lost", animal_type: "Кіт", breed: "Мікс", sex: "male", color: "Рудий", size: "medium", location: "Дніпро, парк Шевченка", last_seen_location: "Дніпро, парк Шевченка, біля фонтану", last_seen_date: "2026-03-28", contact_name: "Марія", contact_phone: "+38 (067) 555-12-34", photos: JSON.stringify(["/uploads/cat2_1.jpg","/uploads/cat2_2.jpg","/uploads/cat2_3.jpg"]) },
    { title: "Пропала сіра кішка Муся", description: "Втекла з балкону 25 березня. Сіра короткошерста кішка, 3 роки, стерилізована.", type: "lost", animal_type: "Кіт", breed: "Європейська короткошерста", sex: "female", color: "Сірий", size: "medium", location: "Дніпро, Лівий берег", last_seen_location: "Дніпро, вул. Калинова 78", last_seen_date: "2026-03-25", contact_name: "Тетяна", contact_phone: "+38 (093) 777-88-99", photos: JSON.stringify(["/uploads/cat1_2.jpg","/uploads/cat1_3.jpg","/uploads/cat1_4.jpg"]) },
    { title: "Загубився білий пес Сніжок", description: "Зірвався з повідка під час прогулянки 30 березня. Білий пес середнього розміру.", type: "lost", animal_type: "Собака", breed: "Мікс", sex: "male", color: "Білий", size: "medium", location: "Дніпро, Перемога", last_seen_location: "Дніпро, вул. Героїв 15", last_seen_date: "2026-03-30", contact_name: "Андрій", contact_phone: "+38 (095) 111-22-33", photos: JSON.stringify(["/uploads/dog3_2.jpg","/uploads/dog3_3.jpg","/uploads/dog3_4.jpg"]) },
  ];

  const insertLost = db.prepare(
    `INSERT INTO lost_animals (title, description, type, animal_type, breed, sex, color, size, location, last_seen_location, last_seen_date, contact_name, contact_phone, photos)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );

  db.transaction(() => {
    for (const a of sampleAnimals) {
      insertAnimal.run(a.name, a.description, a.type, a.breed, a.sex, a.age_months, a.weight_kg, a.size, a.color, a.vaccinated, a.sterilized, a.trained, a.photos, a.contact_name, a.contact_phone, a.contact_email, a.contact_instagram, a.contact_telegram, a.contact_facebook, a.contact_location);
    }
    for (const l of sampleLost) {
      insertLost.run(l.title, l.description, l.type, l.animal_type, l.breed, l.sex, l.color, l.size, l.location, l.last_seen_location, l.last_seen_date, l.contact_name, l.contact_phone, l.photos);
    }
    // Superadmin account
    db.prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)").run("Admin", "admin@gmail.com", "admin", "superadmin");
  })();
}

export default getDb;

export type Animal = {
  id: number;
  name: string;
  description: string | null;
  type: "dog" | "cat" | "other";
  breed: string | null;
  sex: "male" | "female" | null;
  age_months: number | null;
  weight_kg: number | null;
  size: "small" | "medium" | "large" | null;
  color: string | null;
  vaccinated: number;
  sterilized: number;
  trained: number;
  commands: string;
  photos: string;
  contact_name: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  contact_instagram: string | null;
  contact_telegram: string | null;
  contact_facebook: string | null;
  contact_location: string | null;
  status: "available" | "adopted" | "reserved";
  created_at: string;
  updated_at: string;
};

export type AdoptionRequest = {
  id: number;
  animal_id: number;
  name: string;
  email: string;
  phone: string;
  instagram: string | null;
  telegram: string | null;
  facebook: string | null;
  location: string | null;
  message: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

export type LostAnimal = {
  id: number;
  title: string;
  description: string;
  type: "lost" | "found";
  animal_type: string | null;
  breed: string | null;
  sex: string | null;
  color: string | null;
  size: string | null;
  location: string | null;
  last_seen_location: string | null;
  last_seen_date: string | null;
  contact_name: string;
  contact_phone: string;
  photos: string;
  resolved: number;
  created_at: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: "user" | "admin" | "volunteer" | "superadmin";
  photo: string | null;
  description: string | null;
  phone: string | null;
  instagram: string | null;
  telegram: string | null;
  facebook: string | null;
  org_id: number | null;
  created_at: string;
};

export type Organization = {
  id: number;
  name: string;
  description: string | null;
  photo: string | null;
  location: string | null;
  phone: string | null;
  email: string | null;
  instagram: string | null;
  telegram: string | null;
  facebook: string | null;
  website: string | null;
  owner_id: number;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

export type Notification = {
  id: number;
  org_id: number | null;
  type: string;
  title: string;
  message: string | null;
  link: string | null;
  is_read: number;
  created_at: string;
};
