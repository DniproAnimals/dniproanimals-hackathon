import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const supabase = await createClient();

  const { data: result } = await supabase
    .from("adoption_requests")
    .select("*, animals(name, type)")
    .order("created_at", { ascending: false });

  const formatted = (result || []).map((r: Record<string, unknown>) => {
    const animals = r.animals as { name: string; type: string } | null;
    return {
      ...r,
      animal_name: animals?.name,
      animal_type: animals?.type,
      animals: undefined,
    };
  });

  return NextResponse.json(formatted);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { animal_id, name, email, phone, instagram, telegram, facebook, location, message } = body;

  if (!animal_id || !name || !email || !phone) {
    return NextResponse.json(
      { error: "Всі обов'язкові поля мають бути заповнені" },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  const { data: animal } = await supabase
    .from("animals")
    .select("id")
    .eq("id", animal_id)
    .single();

  if (!animal) {
    return NextResponse.json({ error: "Тварину не знайдено" }, { status: 404 });
  }

  const { data: result, error } = await supabase
    .from("adoption_requests")
    .insert({
      animal_id,
      name,
      email,
      phone,
      instagram: instagram || null,
      telegram: telegram || null,
      facebook: facebook || null,
      location: location || null,
      message: message || null,
    })
    .select()
    .single();

  if (error || !result) {
    return NextResponse.json({ error: "Помилка створення заявки" }, { status: 500 });
  }

  return NextResponse.json(
    { id: result.id, success: true },
    { status: 201 }
  );
}

export async function PATCH(request: NextRequest) {
  const user = await getSession();
  if (!user || !user.org_id) {
    return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });
  }

  const { id, status } = await request.json();

  if (!id || !["approved", "rejected"].includes(status)) {
    return NextResponse.json({ error: "Невірні дані" }, { status: 400 });
  }

  const supabase = await createClient();
  await supabase
    .from("adoption_requests")
    .update({ status })
    .eq("id", id);

  return NextResponse.json({ success: true });
}
