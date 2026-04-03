import { NextRequest, NextResponse } from "next/server";
import getDb from "@/lib/db";
import { setSessionCookie } from "@/lib/auth";

// GET — get volunteer + org info by invite token
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "Токен відсутній" }, { status: 400 });
  }

  const db = getDb();
  const volunteer = db.prepare(
    `SELECT v.id, v.name, v.surname, v.org_id, v.user_id, o.name as org_name
     FROM volunteers v
     JOIN organizations o ON o.id = v.org_id
     WHERE v.invite_token = ?`
  ).get(token) as { id: number; name: string; surname: string | null; org_id: number; user_id: number | null; org_name: string } | undefined;

  if (!volunteer) {
    return NextResponse.json({ error: "Невірне або застаріле запрошення" }, { status: 404 });
  }

  if (volunteer.user_id) {
    return NextResponse.json({ error: "Це запрошення вже використано" }, { status: 409 });
  }

  return NextResponse.json({
    volunteer_name: volunteer.name,
    volunteer_surname: volunteer.surname,
    org_name: volunteer.org_name,
  });
}

// POST — accept invite: create user account, link to volunteer + org
export async function POST(request: NextRequest) {
  const { token, email, password } = await request.json();

  if (!token || !email || !password) {
    return NextResponse.json({ error: "Всі поля обов'язкові" }, { status: 400 });
  }

  const db = getDb();
  const volunteer = db.prepare(
    `SELECT v.id, v.name, v.surname, v.org_id, v.user_id
     FROM volunteers v WHERE v.invite_token = ?`
  ).get(token) as { id: number; name: string; surname: string | null; org_id: number; user_id: number | null } | undefined;

  if (!volunteer) {
    return NextResponse.json({ error: "Невірне або застаріле запрошення" }, { status: 404 });
  }

  if (volunteer.user_id) {
    return NextResponse.json({ error: "Це запрошення вже використано" }, { status: 409 });
  }

  // Check email uniqueness
  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (existing) {
    return NextResponse.json({ error: "Цей email вже зареєстровано" }, { status: 409 });
  }

  const fullName = [volunteer.name, volunteer.surname].filter(Boolean).join(" ");

  // Create user account
  const result = db.prepare(
    "INSERT INTO users (name, email, password, role, org_id) VALUES (?, ?, ?, 'volunteer', ?)"
  ).run(fullName, email, password, volunteer.org_id);

  const userId = Number(result.lastInsertRowid);

  // Link volunteer record to user
  db.prepare("UPDATE volunteers SET user_id = ? WHERE id = ?").run(userId, volunteer.id);

  const res = NextResponse.json({
    id: userId,
    name: fullName,
    email,
    role: "volunteer",
    org_id: volunteer.org_id,
  }, { status: 201 });
  res.cookies.set(setSessionCookie(userId));
  return res;
}
