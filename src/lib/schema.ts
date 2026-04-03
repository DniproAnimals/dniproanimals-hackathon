import { pgTable, serial, text, integer, real, boolean, timestamp, unique } from "drizzle-orm/pg-core";

export const animals = pgTable("animals", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").notNull(),
  breed: text("breed"),
  sex: text("sex"),
  age_months: integer("age_months"),
  weight_kg: real("weight_kg"),
  size: text("size"),
  color: text("color"),
  vaccinated: boolean("vaccinated").default(false),
  sterilized: boolean("sterilized").default(false),
  trained: boolean("trained").default(false),
  commands: text("commands").default("[]"),
  photos: text("photos").default("[]"),
  contact_name: text("contact_name"),
  contact_phone: text("contact_phone"),
  contact_email: text("contact_email"),
  contact_instagram: text("contact_instagram"),
  contact_telegram: text("contact_telegram"),
  contact_facebook: text("contact_facebook"),
  contact_location: text("contact_location"),
  status: text("status").default("available"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const adoptionRequests = pgTable("adoption_requests", {
  id: serial("id").primaryKey(),
  animal_id: integer("animal_id").notNull().references(() => animals.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  instagram: text("instagram"),
  telegram: text("telegram"),
  facebook: text("facebook"),
  location: text("location"),
  message: text("message"),
  status: text("status").default("pending"),
  created_at: timestamp("created_at").defaultNow(),
});

export const lostAnimals = pgTable("lost_animals", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(),
  animal_type: text("animal_type"),
  breed: text("breed"),
  sex: text("sex"),
  color: text("color"),
  size: text("size"),
  location: text("location"),
  last_seen_location: text("last_seen_location"),
  last_seen_date: text("last_seen_date"),
  contact_name: text("contact_name").notNull(),
  contact_phone: text("contact_phone").notNull(),
  photos: text("photos").default("[]"),
  resolved: boolean("resolved").default(false),
  created_at: timestamp("created_at").defaultNow(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").default("user"),
  photo: text("photo"),
  description: text("description"),
  phone: text("phone"),
  instagram: text("instagram"),
  telegram: text("telegram"),
  facebook: text("facebook"),
  org_id: integer("org_id"),
  created_at: timestamp("created_at").defaultNow(),
});

export const organizations = pgTable("organizations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  photo: text("photo"),
  location: text("location"),
  phone: text("phone"),
  email: text("email"),
  instagram: text("instagram"),
  telegram: text("telegram"),
  facebook: text("facebook"),
  website: text("website"),
  owner_id: integer("owner_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  status: text("status").default("pending"),
  monobank_jar_id: text("monobank_jar_id"),
  created_at: timestamp("created_at").defaultNow(),
});


export const volunteers = pgTable("volunteers", {
  id: serial("id").primaryKey(),
  org_id: integer("org_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  user_id: integer("user_id").references(() => users.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  surname: text("surname"),
  photo: text("photo"),
  description: text("description"),
  phone: text("phone"),
  email: text("email"),
  instagram: text("instagram"),
  telegram: text("telegram"),
  invite_token: text("invite_token").unique(),
  created_at: timestamp("created_at").defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  org_id: integer("org_id"),
  type: text("type").notNull(),
  title: text("title").notNull(),
  message: text("message"),
  link: text("link"),
  is_read: boolean("is_read").default(false),
  created_at: timestamp("created_at").defaultNow(),
});

export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  animal_id: integer("animal_id").notNull().references(() => animals.id, { onDelete: "cascade" }),
  created_at: timestamp("created_at").defaultNow(),
}, (table) => [
  unique("favorites_user_animal_unique").on(table.user_id, table.animal_id),
]);
