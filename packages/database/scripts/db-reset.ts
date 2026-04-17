import "@dniproanimals/env/load";
import { execSync } from "node:child_process";
import pg from "pg";
import { getDatabaseUrl } from "../src/utils/get-database-url";

async function resetDatabase() {
  const sql = new pg.Client(getDatabaseUrl());
  await sql.connect();

  try {
    console.log("Dropping all tables...");

    await sql.query(`
      DROP SCHEMA IF EXISTS drizzle CASCADE;
      DROP SCHEMA public CASCADE;
      CREATE SCHEMA public;
      GRANT ALL ON SCHEMA public TO public;
    `);
    console.log("All tables dropped.\n");

    await sql.end();

    console.log("Running migrations...");
    execSync("npm run db:migrate", { stdio: "inherit" });
    console.log("\nDatabase reset complete!");
  } catch (error) {
    console.error("Database reset failed:", error);
    await sql.end();
    process.exit(1);
  }
}

resetDatabase();
