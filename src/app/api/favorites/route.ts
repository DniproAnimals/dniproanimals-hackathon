import { NextRequest, NextResponse } from "next/server";
import getDb from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const user = await getSession();
  if (!user) return NextResponse.json([]);

  const db = getDb();
  const favorites = db
    .prepare(
      `SELECT a.* FROM favorites f JOIN animals a ON f.animal_id = a.id WHERE f.user_id = ? ORDER BY f.created_at DESC`
    )
    .all(user.id);
  return NextResponse.json(favorites);
}

export async function POST(request: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });

  const { animal_id } = await request.json();
  const db = getDb();

  const existing = db
    .prepare("SELECT id FROM favorites WHERE user_id = ? AND animal_id = ?")
    .get(user.id, animal_id);

  if (existing) {
    db.prepare("DELETE FROM favorites WHERE user_id = ? AND animal_id = ?").run(user.id, animal_id);
    return NextResponse.json({ favorited: false });
  } else {
    db.prepare("INSERT INTO favorites (user_id, animal_id) VALUES (?, ?)").run(user.id, animal_id);
    return NextResponse.json({ favorited: true });
  }
}
