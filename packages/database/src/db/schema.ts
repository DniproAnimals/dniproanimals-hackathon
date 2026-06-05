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
export type OrgStatus = "pending" | "approved" | "rejected";
export type AnimalType = "dog" | "cat" | "other";
export type AnimalSize = "small" | "medium" | "large";
export type AnimalSex = "male" | "female";
export type AnimalStatus = "available" | "reserved" | "adopted";
export type AdoptionStatus = "pending" | "approved" | "rejected";
export type LostType = "lost" | "found";

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
  orgId: integer("org_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const organizationsTable = pgTable("organizations", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  description: text(),
  photo: varchar({ length: 1024 }),
  location: varchar({ length: 255 }),
  phone: varchar({ length: 50 }),
  email: varchar({ length: 255 }),
  instagram: varchar({ length: 255 }),
  telegram: varchar({ length: 255 }),
  facebook: varchar({ length: 255 }),
  website: varchar({ length: 512 }),
  ownerId: integer("owner_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  status: varchar({ length: 20 })
    .notNull()
    .default("pending")
    .$type<OrgStatus>(),
  monobankJarId: varchar("monobank_jar_id", { length: 255 }),
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
  vaccinated: boolean(),
  sterilized: boolean(),
  trained: boolean(),
  commands: text(),
  photos: text().notNull().default("[]"),
  contactName: varchar("contact_name", { length: 255 }),
  contactPhone: varchar("contact_phone", { length: 50 }),
  contactEmail: varchar("contact_email", { length: 255 }),
  contactInstagram: varchar("contact_instagram", { length: 255 }),
  contactTelegram: varchar("contact_telegram", { length: 255 }),
  contactFacebook: varchar("contact_facebook", { length: 255 }),
  contactLocation: varchar("contact_location", { length: 255 }),
  orgId: integer("org_id").references(() => organizationsTable.id, {
    onDelete: "set null",
  }),
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

export const lostAnimalsTable = pgTable("lost_animals", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 255 }).notNull(),
  description: text().notNull(),
  type: varchar({ length: 10 }).notNull().$type<LostType>(),
  animalType: varchar("animal_type", { length: 20 }),
  breed: varchar({ length: 255 }),
  sex: varchar({ length: 10 }),
  color: varchar({ length: 100 }),
  size: varchar({ length: 20 }),
  location: varchar({ length: 255 }),
  lastSeenLocation: varchar("last_seen_location", { length: 255 }),
  lastSeenDate: varchar("last_seen_date", { length: 50 }),
  contactName: varchar("contact_name", { length: 255 }).notNull(),
  contactPhone: varchar("contact_phone", { length: 50 }).notNull(),
  photos: text().notNull().default("[]"),
  resolved: boolean().notNull().default(false),
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

export const volunteersTable = pgTable("volunteers", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  orgId: integer("org_id")
    .notNull()
    .references(() => organizationsTable.id, { onDelete: "cascade" }),
  userId: integer("user_id").references(() => usersTable.id, {
    onDelete: "set null",
  }),
  name: varchar({ length: 255 }).notNull(),
  surname: varchar({ length: 255 }),
  photo: varchar({ length: 1024 }),
  description: text(),
  phone: varchar({ length: 50 }),
  email: varchar({ length: 255 }),
  instagram: varchar({ length: 255 }),
  telegram: varchar({ length: 255 }),
  inviteToken: varchar("invite_token", { length: 255 }).unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const notificationsTable = pgTable("notifications", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  orgId: integer("org_id").references(() => organizationsTable.id, {
    onDelete: "cascade",
  }),
  type: varchar({ length: 50 }).notNull(),
  title: varchar({ length: 255 }).notNull(),
  message: text(),
  link: varchar({ length: 512 }),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
