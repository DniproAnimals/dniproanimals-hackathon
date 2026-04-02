import { NextRequest, NextResponse } from "next/server";
import getDb from "@/lib/db";
import { setSessionCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const db = getDb();
  const { name, email, password } = await request.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Всі поля обов'язкові" }, { status: 400 });
  }

  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (existing) {
    return NextResponse.json({ error: "Цей email вже зареєстровано" }, { status: 409 });
  }

  const result = db
    .prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)")
    .run(name, email, password);

  const res = NextResponse.json({ id: result.lastInsertRowid, name, email }, { status: 201 });
  res.cookies.set(setSessionCookie(Number(result.lastInsertRowid)));
  return res;
}
