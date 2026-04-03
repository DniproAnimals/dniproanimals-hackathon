import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const supabase = await createClient();
  const { data: orgs } = await supabase
    .from("organizations")
    .select("*")
    .order("created_at", { ascending: false });

  return NextResponse.json(orgs || []);
}

export async function POST(request: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });

  const { name, description, photo, location, phone, email, instagram, telegram, facebook, website } = await request.json();
  if (!name) return NextResponse.json({ error: "Назва обов'язкова" }, { status: 400 });

  const supabase = await createClient();

  const { data: result, error } = await supabase
    .from("organizations")
    .insert({
      name,
      description: description || null,
      photo: photo || null,
      location: location || null,
      phone: phone || null,
      email: email || null,
      instagram: instagram || null,
      telegram: telegram || null,
      facebook: facebook || null,
      website: website || null,
      owner_id: user.id,
    })
    .select()
    .single();

  if (error || !result) {
    return NextResponse.json({ error: "Помилка створення" }, { status: 500 });
  }

  await supabase
    .from("users")
    .update({ role: "admin", org_id: result.id })
    .eq("id", user.id);

  await supabase.from("notifications").insert({
    org_id: result.id,
    type: "org_created",
    title: `Нова організація: ${name}`,
    message: "Організація очікує модерації",
  });

  return NextResponse.json({ id: result.id }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const user = await getSession();
  if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
    return NextResponse.json({ error: "Недостатньо прав" }, { status: 403 });
  }

  const { id, status } = await request.json();
  if (!id || !["approved", "rejected"].includes(status)) {
    return NextResponse.json({ error: "Невірні дані" }, { status: 400 });
  }

  const supabase = await createClient();
  await supabase.from("organizations").update({ status }).eq("id", id);
  return NextResponse.json({ success: true });
}

export async function PUT(request: NextRequest) {
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
    return NextResponse.json({ error: "Тільки власник може редагувати організацію" }, { status: 403 });
  }

  const { name, description, location, phone, email, instagram, telegram, facebook, website } = await request.json();
  if (!name) return NextResponse.json({ error: "Назва обов'язкова" }, { status: 400 });

  await supabase
    .from("organizations")
    .update({
      name,
      description: description || null,
      location: location || null,
      phone: phone || null,
      email: email || null,
      instagram: instagram || null,
      telegram: telegram || null,
      facebook: facebook || null,
      website: website || null,
    })
    .eq("id", user.org_id);

  return NextResponse.json({ success: true });
}
