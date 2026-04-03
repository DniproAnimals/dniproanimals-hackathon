import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/db";
import { setSessionCookie } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "Токен відсутній" }, { status: 400 });
  }

  const supabase = await createClient();

  const { data: volunteer } = await supabase
    .from("volunteers")
    .select("id, name, surname, org_id, user_id, organizations(name)")
    .eq("invite_token", token)
    .single();

  if (!volunteer) {
    return NextResponse.json({ error: "Невірне або застаріле запрошення" }, { status: 404 });
  }

  if (volunteer.user_id) {
    return NextResponse.json({ error: "Це запрошення вже використано" }, { status: 409 });
  }

  const org = volunteer.organizations as unknown as { name: string } | null;

  return NextResponse.json({
    volunteer_name: volunteer.name,
    volunteer_surname: volunteer.surname,
    org_name: org?.name,
  });
}

export async function POST(request: NextRequest) {
  const { token, email, password } = await request.json();

  if (!token || !email || !password) {
    return NextResponse.json({ error: "Всі поля обов'язкові" }, { status: 400 });
  }

  const supabase = await createClient();

  const { data: volunteer } = await supabase
    .from("volunteers")
    .select("id, name, surname, org_id, user_id")
    .eq("invite_token", token)
    .single();

  if (!volunteer) {
    return NextResponse.json({ error: "Невірне або застаріле запрошення" }, { status: 404 });
  }

  if (volunteer.user_id) {
    return NextResponse.json({ error: "Це запрошення вже використано" }, { status: 409 });
  }

  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .single();

  if (existing) {
    return NextResponse.json({ error: "Цей email вже зареєстровано" }, { status: 409 });
  }

  const fullName = [volunteer.name, volunteer.surname].filter(Boolean).join(" ");

  const { data: newUser, error } = await supabase
    .from("users")
    .insert({
      name: fullName,
      email,
      password,
      role: "volunteer",
      org_id: volunteer.org_id,
    })
    .select()
    .single();

  if (error || !newUser) {
    return NextResponse.json({ error: "Помилка реєстрації" }, { status: 500 });
  }

  await supabase
    .from("volunteers")
    .update({ user_id: newUser.id })
    .eq("id", volunteer.id);

  const res = NextResponse.json({
    id: newUser.id,
    name: fullName,
    email,
    role: "volunteer",
    org_id: volunteer.org_id,
  }, { status: 201 });
  res.cookies.set(setSessionCookie(newUser.id));
  return res;
}
