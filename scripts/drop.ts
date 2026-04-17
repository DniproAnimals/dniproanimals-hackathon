import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

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
