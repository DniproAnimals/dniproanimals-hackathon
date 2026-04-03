import { NextRequest, NextResponse } from "next/server";
import getDb from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const db = getDb();
  const orgs = db.prepare("SELECT * FROM organizations ORDER BY created_at DESC").all();
  return NextResponse.json(orgs);
}

export async function POST(request: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });

  const db = getDb();
  const { name, description, photo, location, phone, email, instagram, telegram, facebook, website } = await request.json();

  if (!name) return NextResponse.json({ error: "Назва обов'язкова" }, { status: 400 });

  const result = db.prepare(
    `INSERT INTO organizations (name, description, photo, location, phone, email, instagram, telegram, facebook, website, owner_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(name, description || null, photo || null, location || null, phone || null, email || null, instagram || null, telegram || null, facebook || null, website || null, user.id);

  // Update user role to admin and link to org
  db.prepare("UPDATE users SET role = 'admin', org_id = ? WHERE id = ?").run(result.lastInsertRowid, user.id);

  // Create notification
  db.prepare("INSERT INTO notifications (org_id, type, title, message) VALUES (?, ?, ?, ?)").run(
    result.lastInsertRowid, "org_created", `Нова організація: ${name}`, "Організація очікує модерації"
  );

  return NextResponse.json({ id: result.lastInsertRowid }, { status: 201 });
}
