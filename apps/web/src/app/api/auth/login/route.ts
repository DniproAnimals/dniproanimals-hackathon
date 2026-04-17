import { setSessionCookie } from "@/shared/lib/auth";
import { createClient } from "@/shared/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email та пароль обов'язкові" },
      { status: 400 },
    );
  }

  const supabase = await createClient();
  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (!user || user.password !== password) {
    return NextResponse.json(
      { error: "Невірний email або пароль" },
      { status: 401 },
    );
  }

  const res = NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    org_id: user.org_id,
  });
  res.cookies.set(setSessionCookie(user.id));
  return res;
}
