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
      location TEXT,
      contact_name TEXT NOT NULL,
      contact_phone TEXT NOT NULL,
      photos TEXT DEFAULT '[]',
      resolved INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
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
  location: string | null;
  contact_name: string;
  contact_phone: string;
  photos: string;
  resolved: number;
  created_at: string;
};
