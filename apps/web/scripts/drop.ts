import "@dniproanimals/env";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_KEY, SUPABASE_URL } from "../src/shared/constants/env";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const tables = [
  "favorites",
  "adoption_requests",
  "notifications",
  "volunteers",
  "animals",
  "organizations",
  "users",
  "lost_animals",
];

async function drop() {
  console.log("🗑️  Dropping all tables...\n");

  for (const table of tables) {
    const { error } = await supabase.rpc("exec_sql", {
      query: `DROP TABLE IF EXISTS "${table}" CASCADE`,
    });

    if (error) {
      // fallback: delete all rows if can't drop
      const { error: deleteErr } = await supabase
        .from(table)
        .delete()
        .gte("id", 0);
      if (deleteErr) {
        console.log(`❌ ${table}: ${deleteErr.message}`);
      } else {
        console.log(`🧹 ${table}: cleared all rows (no DROP permission)`);
      }
    } else {
      console.log(`✅ ${table}: dropped`);
    }
  }

  console.log("\n🎉 Done!");
}

drop().catch((err) => {
  console.error("❌ Failed:", err.message);
  process.exit(1);
});
