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
