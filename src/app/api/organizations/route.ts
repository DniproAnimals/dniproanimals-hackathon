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

export async function PATCH(request: NextRequest) {
  const user = await getSession();
  if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
    return NextResponse.json({ error: "Недостатньо прав" }, { status: 403 });
  }

  const db = getDb();
  const { id, status } = await request.json();

  if (!id || !["approved", "rejected"].includes(status)) {
    return NextResponse.json({ error: "Невірні дані" }, { status: 400 });
  }

  db.prepare("UPDATE organizations SET status = ? WHERE id = ?").run(status, id);
  return NextResponse.json({ success: true });
}

export async function PUT(request: NextRequest) {
  const user = await getSession();
  if (!user || !user.org_id) {
    return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });
  }

  const db = getDb();
  const org = db.prepare("SELECT owner_id FROM organizations WHERE id = ?").get(user.org_id) as { owner_id: number } | undefined;
  if (!org || org.owner_id !== user.id) {
    return NextResponse.json({ error: "Тільки власник може редагувати організацію" }, { status: 403 });
  }

  const { name, description, location, phone, email, instagram, telegram, facebook, website } = await request.json();
  if (!name) return NextResponse.json({ error: "Назва обов'язкова" }, { status: 400 });

  db.prepare(
    `UPDATE organizations SET name = ?, description = ?, location = ?, phone = ?, email = ?, instagram = ?, telegram = ?, facebook = ?, website = ? WHERE id = ?`
  ).run(name, description || null, location || null, phone || null, email || null, instagram || null, telegram || null, facebook || null, website || null, user.org_id);

  return NextResponse.json({ success: true });
}
