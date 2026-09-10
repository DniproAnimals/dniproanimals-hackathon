import { env } from "@dniproanimals/env";
import "@dniproanimals/env/load";
import { defineConfig } from "drizzle-kit";

if (!env.DATABASE_URL_UNPOOLED) {
  throw new Error("DATABASE_URL_UNPOOLED is required for database migrations");
}

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL_UNPOOLED,
  },
});
