import "@dniproanimals/env/load";
import pg from "pg";
import { getDatabaseUrl } from "../src/utils/get-database-url";

async function drop() {
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
    console.log("Done.");
  } catch (error) {
    console.error("Drop failed:", error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

drop();
