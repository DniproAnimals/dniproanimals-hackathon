import "@dniproanimals/env/load";
import { drizzle } from "drizzle-orm/node-postgres";
import { getDatabaseUrl } from "./utils/get-database-url";

export const db = drizzle(getDatabaseUrl());
export * from "drizzle-orm";
export * from "./db/defaults";
export * from "./db/schema";
