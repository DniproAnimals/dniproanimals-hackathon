import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/db";

export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get("type");
  const supabase = await createClient();

  let query = supabase
    .from("lost_animals")
    .select("*")
    .eq("resolved", false)
    .order("created_at", { ascending: false });

  if (type) {
    query = query.eq("type", type);
  }

  const { data: items } = await query;
  return NextResponse.json(items || []);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const {
    title, description, type, animal_type, breed, sex, color, size,
    location, last_seen_location, last_seen_date, contact_name, contact_phone, photos,
  } = body;

  if (!title || !description || !type || !contact_name || !contact_phone) {
    return NextResponse.json(
      { error: "Всі обов'язкові поля мають бути заповнені" },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  const { data: result, error } = await supabase
    .from("lost_animals")
    .insert({
      title,
      description,
      type,
      animal_type: animal_type || null,
      breed: breed || null,
      sex: sex || null,
      color: color || null,
      size: size || null,
      location: location || null,
      last_seen_location: last_seen_location || null,
      last_seen_date: last_seen_date || null,
      contact_name,
      contact_phone,
      photos: JSON.stringify(photos || []),
    })
    .select()
    .single();

  if (error || !result) {
    return NextResponse.json({ error: "Помилка створення" }, { status: 500 });
  }

  return NextResponse.json(
    { id: result.id, success: true },
    { status: 201 }
  );
}
