import {
  boolean,
  integer,
  pgTable,
  real,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export type UserRole = "user" | "admin" | "volunteer" | "superadmin";
export type AnimalType = "dog" | "cat" | "other";
export type AnimalSize = "small" | "medium" | "large";
export type AnimalSex = "male" | "female";
export type AnimalStatus = "available" | "reserved" | "adopted";
export type AdoptionStatus = "pending" | "approved" | "rejected";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }),
  googleId: varchar("google_id", { length: 255 }).unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  emailVerificationToken: varchar("email_verification_token", { length: 255 }),
  emailVerificationTokenExpires: timestamp("email_verification_token_expires"),
  role: varchar({ length: 20 }).notNull().default("user").$type<UserRole>(),
  photo: varchar({ length: 1024 }),
  description: text(),
  phone: varchar({ length: 50 }),
  instagram: varchar({ length: 255 }),
  telegram: varchar({ length: 255 }),
  facebook: varchar({ length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const animalsTable = pgTable("animals", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  description: text(),
  type: varchar({ length: 20 }).notNull().$type<AnimalType>(),
  breed: varchar({ length: 255 }),
  sex: varchar({ length: 10 }).$type<AnimalSex>(),
  ageMonths: integer("age_months"),
  weightKg: real("weight_kg"),
  size: varchar({ length: 20 }).$type<AnimalSize>(),
  color: varchar({ length: 100 }),
  vaccinated: boolean().notNull().default(true),
  sterilized: boolean().notNull().default(true),
  trained: boolean().notNull().default(true),
  commands: text(),
  photos: text().notNull().default("[]"),
  contactName: varchar("contact_name", { length: 255 }),
  contactPhone: varchar("contact_phone", { length: 50 }),
  contactEmail: varchar("contact_email", { length: 255 }),
  contactInstagram: varchar("contact_instagram", { length: 255 }),
  contactTelegram: varchar("contact_telegram", { length: 255 }),
  contactFacebook: varchar("contact_facebook", { length: 255 }),
  contactLocation: varchar("contact_location", { length: 255 }),
  status: varchar({ length: 20 })
    .notNull()
    .default("available")
    .$type<AnimalStatus>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const adoptionRequestsTable = pgTable("adoption_requests", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  animalId: integer("animal_id")
    .notNull()
    .references(() => animalsTable.id, { onDelete: "cascade" }),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull(),
  phone: varchar({ length: 50 }).notNull(),
  instagram: varchar({ length: 255 }),
  telegram: varchar({ length: 255 }),
  facebook: varchar({ length: 255 }),
  location: varchar({ length: 255 }),
  message: text(),
  status: varchar({ length: 20 })
    .notNull()
    .default("pending")
    .$type<AdoptionStatus>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const favoritesTable = pgTable("favorites", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  animalId: integer("animal_id")
    .notNull()
    .references(() => animalsTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const notificationsTable = pgTable("notifications", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  type: varchar({ length: 50 }).notNull(),
  title: varchar({ length: 255 }).notNull(),
  message: text(),
  link: varchar({ length: 512 }),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const foundationTable = pgTable("foundation", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull().default("Притулок ДніпроAnimals"),
  description: text(),
  address: varchar({ length: 512 }),
  phone: varchar({ length: 50 }),
  email: varchar({ length: 255 }),
  instagram: varchar({ length: 255 }),
  telegram: varchar({ length: 255 }),
  facebook: varchar({ length: 255 }),
  monobankJarUrl: varchar("monobank_jar_url", { length: 512 }),
  paypalEmail: varchar("paypal_email", { length: 255 }),
  patreonUrl: varchar("patreon_url", { length: 512 }),
  buyMeACoffeeUrl: varchar("buy_me_a_coffee_url", { length: 512 }),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
