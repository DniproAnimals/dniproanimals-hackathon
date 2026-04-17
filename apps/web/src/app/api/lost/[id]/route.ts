import { createClient } from "@/shared/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("lost_animals")
    .select("id")
    .eq("id", Number(id))
    .single();

  if (!existing) {
    return NextResponse.json(
      { error: "Оголошення не знайдено" },
      { status: 404 },
    );
  }

  const {
    title,
    description,
    type,
    animal_type,
    breed,
    sex,
    color,
    size,
    location,
    last_seen_location,
    last_seen_date,
    contact_name,
    contact_phone,
    photos,
  } = body;

  const { data: updated } = await supabase
    .from("lost_animals")
    .update({
      title,
      description,
      type: type || "lost",
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
    .eq("id", Number(id))
    .select()
    .single();

  return NextResponse.json(updated);
}
