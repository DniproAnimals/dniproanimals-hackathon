import { NextRequest, NextResponse } from "next/server";
import getDb from "@/lib/db";
import { getSession } from "@/lib/auth";
import crypto from "crypto";

export async function GET() {
  const user = await getSession();
  if (!user || !user.org_id) {
    return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });
  }

  const db = getDb();
  const volunteers = db
    .prepare("SELECT * FROM volunteers WHERE org_id = ? ORDER BY created_at DESC")
    .all(user.org_id);

  return NextResponse.json(volunteers);
}

export async function POST(request: NextRequest) {
  const user = await getSession();
  if (!user || !user.org_id) {
    return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });
  }

  // Only org owner can add volunteers
  const db = getDb();
  const org = db.prepare("SELECT owner_id FROM organizations WHERE id = ?").get(user.org_id) as { owner_id: number } | undefined;
  if (!org || org.owner_id !== user.id) {
    return NextResponse.json({ error: "Тільки власник організації може додавати волонтерів" }, { status: 403 });
  }

  const { name, surname, photo, description, phone, email, instagram, telegram } = await request.json();
  if (!name) {
    return NextResponse.json({ error: "Ім'я обов'язкове" }, { status: 400 });
  }

  const invite_token = crypto.randomBytes(24).toString("hex");

  const result = db.prepare(
    `INSERT INTO volunteers (org_id, name, surname, photo, description, phone, email, instagram, telegram, invite_token)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    user.org_id, name, surname || null, photo || null, description || null,
    phone || null, email || null, instagram || null, telegram || null, invite_token
  );

  return NextResponse.json({
    id: result.lastInsertRowid,
    invite_token,
  }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const user = await getSession();
  if (!user || !user.org_id) {
    return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });
  }

  const db = getDb();
  const org = db.prepare("SELECT owner_id FROM organizations WHERE id = ?").get(user.org_id) as { owner_id: number } | undefined;
  if (!org || org.owner_id !== user.id) {
    return NextResponse.json({ error: "Тільки власник організації може видаляти волонтерів" }, { status: 403 });
  }

  const { id } = await request.json();

  // Unlink user account if connected
  const volunteer = db.prepare("SELECT user_id FROM volunteers WHERE id = ? AND org_id = ?").get(id, user.org_id) as { user_id: number | null } | undefined;
  if (volunteer?.user_id) {
    db.prepare("UPDATE users SET role = 'user', org_id = NULL WHERE id = ?").run(volunteer.user_id);
  }

  db.prepare("DELETE FROM volunteers WHERE id = ? AND org_id = ?").run(id, user.org_id);
  return NextResponse.json({ success: true });
}
