import "@dniproanimals/env/load";
import { defineConfig } from "drizzle-kit";
import { getDatabaseUrl } from "./src/utils/get-database-url";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: getDatabaseUrl(),
  },
});
