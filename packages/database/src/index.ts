import "@dniproanimals/env/load";
import { drizzle } from "drizzle-orm/node-postgres";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to connect to the database");
}

export const db = drizzle(databaseUrl);
export * from "drizzle-orm";
export * from "./db/defaults";
export * from "./db/schema";
