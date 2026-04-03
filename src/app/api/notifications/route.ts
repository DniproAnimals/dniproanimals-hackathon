import { NextResponse } from "next/server";
import getDb from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const user = await getSession();
  if (!user || user.role === "user") return NextResponse.json([]);
  const db = getDb();
  const notifs = db.prepare("SELECT * FROM notifications ORDER BY created_at DESC LIMIT 50").all();
  return NextResponse.json(notifs);
}
