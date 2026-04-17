import { getSession } from "@/shared/lib/auth";
import { createClient } from "@/shared/lib/db";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const user = await getSession();
  if (!user || !user.org_id) {
    return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });
  }

  const supabase = await createClient();
  const { data: result } = await supabase
    .from("volunteers")
    .select("*")
    .eq("org_id", user.org_id)
    .order("created_at", { ascending: false });

  return NextResponse.json(result || []);
}

export async function POST(request: NextRequest) {
  const user = await getSession();
  if (!user || !user.org_id) {
    return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });
  }

  const supabase = await createClient();

  const { data: org } = await supabase
    .from("organizations")
    .select("owner_id")
    .eq("id", user.org_id)
    .single();

  if (!org || org.owner_id !== user.id) {
    return NextResponse.json(
      { error: "Тільки власник організації може додавати волонтерів" },
      { status: 403 },
    );
  }

  const {
    name,
    surname,
    photo,
    description,
    phone,
    email,
    instagram,
    telegram,
  } = await request.json();
  if (!name) {
    return NextResponse.json({ error: "Ім'я обов'язкове" }, { status: 400 });
  }

  const invite_token = crypto.randomBytes(24).toString("hex");

  const { data: result, error } = await supabase
    .from("volunteers")
    .insert({
      org_id: user.org_id,
      name,
      surname: surname || null,
      photo: photo || null,
      description: description || null,
      phone: phone || null,
      email: email || null,
      instagram: instagram || null,
      telegram: telegram || null,
      invite_token,
    })
    .select()
    .single();

  if (error || !result) {
    return NextResponse.json({ error: "Помилка створення" }, { status: 500 });
  }

  return NextResponse.json(
    {
      id: result.id,
      invite_token,
    },
    { status: 201 },
  );
}

export async function PUT(request: NextRequest) {
  const user = await getSession();
  if (!user || !user.org_id)
    return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });

  const supabase = await createClient();

  const { data: org } = await supabase
    .from("organizations")
    .select("owner_id")
    .eq("id", user.org_id)
    .single();

  if (!org || org.owner_id !== user.id)
    return NextResponse.json({ error: "Недостатньо прав" }, { status: 403 });

  const {
    id,
    name,
    surname,
    photo,
    description,
    phone,
    email,
    instagram,
    telegram,
  } = await request.json();
  if (!id || !name)
    return NextResponse.json({ error: "Невірні дані" }, { status: 400 });

  await supabase
    .from("volunteers")
    .update({
      name,
      surname: surname || null,
      photo: photo || null,
      description: description || null,
      phone: phone || null,
      email: email || null,
      instagram: instagram || null,
      telegram: telegram || null,
    })
    .eq("id", id)
    .eq("org_id", user.org_id);

  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const user = await getSession();
  if (!user || !user.org_id) {
    return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });
  }

  const supabase = await createClient();

  const { data: org } = await supabase
    .from("organizations")
    .select("owner_id")
    .eq("id", user.org_id)
    .single();

  if (!org || org.owner_id !== user.id) {
    return NextResponse.json(
      { error: "Тільки власник організації може видаляти волонтерів" },
      { status: 403 },
    );
  }

  const { id } = await request.json();

  const { data: volunteer } = await supabase
    .from("volunteers")
    .select("user_id")
    .eq("id", id)
    .eq("org_id", user.org_id)
    .single();

  if (volunteer?.user_id) {
    await supabase
      .from("users")
      .update({ role: "user", org_id: null })
      .eq("id", volunteer.user_id);
  }

  await supabase
    .from("volunteers")
    .delete()
    .eq("id", id)
    .eq("org_id", user.org_id);

  return NextResponse.json({ success: true });
}
