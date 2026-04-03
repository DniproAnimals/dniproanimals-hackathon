import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: animal } = await supabase
    .from("animals")
    .select("*")
    .eq("id", Number(id))
    .single();

  if (!animal) {
    return NextResponse.json({ error: "Тварину не знайдено" }, { status: 404 });
  }

  let org = null;
  if (animal.org_id) {
    const { data } = await supabase
      .from("organizations")
      .select("id, name, photo, location")
      .eq("id", animal.org_id)
      .single();
    org = data;
  }

  return NextResponse.json({ ...animal, org });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("animals")
    .select("id")
    .eq("id", Number(id))
    .single();

  if (!existing) {
    return NextResponse.json({ error: "Тварину не знайдено" }, { status: 404 });
  }

  const {
    name, description, type, breed, sex, age_months, weight_kg,
    size, color, vaccinated, sterilized, trained, photos, status,
    contact_name, contact_phone, contact_email, contact_instagram,
    contact_telegram, contact_facebook, contact_location,
  } = body;

  const { data: updated } = await supabase
    .from("animals")
    .update({
      name,
      description: description || null,
      type,
      breed: breed || null,
      sex: sex || null,
      age_months: age_months || null,
      weight_kg: weight_kg || null,
      size: size || null,
      color: color || null,
      vaccinated: !!vaccinated,
      sterilized: !!sterilized,
      trained: !!trained,
      photos: JSON.stringify(photos || []),
      status: status || "available",
      contact_name: contact_name || null,
      contact_phone: contact_phone || null,
      contact_email: contact_email || null,
      contact_instagram: contact_instagram || null,
      contact_telegram: contact_telegram || null,
      contact_facebook: contact_facebook || null,
      contact_location: contact_location || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", Number(id))
    .select()
    .single();

  return NextResponse.json(updated);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("animals")
    .select("id")
    .eq("id", Number(id))
    .single();

  if (!existing) {
    return NextResponse.json({ error: "Тварину не знайдено" }, { status: 404 });
  }

  await supabase.from("animals").delete().eq("id", Number(id));
  return NextResponse.json({ success: true });
}
