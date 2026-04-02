import { NextRequest, NextResponse } from "next/server";
import getDb, { type User } from "@/lib/db";
import { setSessionCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const db = getDb();
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email та пароль обов'язкові" }, { status: 400 });
  }

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as User | undefined;
  if (!user || user.password !== password) {
    return NextResponse.json({ error: "Невірний email або пароль" }, { status: 401 });
  }

  const res = NextResponse.json({ id: user.id, name: user.name, email: user.email, role: user.role });
  res.cookies.set(setSessionCookie(user.id));
  return res;
}
