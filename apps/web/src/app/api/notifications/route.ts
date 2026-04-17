import { getSession } from "@/shared/lib/auth";
import { createClient } from "@/shared/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getSession();
  if (!user || user.role === "user") return NextResponse.json([]);

  const supabase = await createClient();
  const { data: notifs } = await supabase
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  return NextResponse.json(notifs || []);
}
