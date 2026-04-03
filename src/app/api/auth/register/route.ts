import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/db";
import { setSessionCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const { name, email, password } = await request.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Всі поля обов'язкові" }, { status: 400 });
  }

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .single();

  if (existing) {
    return NextResponse.json({ error: "Цей email вже зареєстровано" }, { status: 409 });
  }

  const { data: result, error } = await supabase
    .from("users")
    .insert({ name, email, password })
    .select()
    .single();

  if (error || !result) {
    return NextResponse.json({ error: "Помилка реєстрації" }, { status: 500 });
  }

  const res = NextResponse.json({ id: result.id, name, email, role: "user" }, { status: 201 });
  res.cookies.set(setSessionCookie(result.id));
  return res;
}
