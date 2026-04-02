import { NextRequest, NextResponse } from "next/server";
import getDb from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = getDb();
  const animal = db.prepare("SELECT * FROM animals WHERE id = ?").get(id);

  if (!animal) {
    return NextResponse.json({ error: "Тварину не знайдено" }, { status: 404 });
  }

  return NextResponse.json(animal);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = getDb();
  const body = await request.json();

  const existing = db.prepare("SELECT * FROM animals WHERE id = ?").get(id);
  if (!existing) {
    return NextResponse.json({ error: "Тварину не знайдено" }, { status: 404 });
  }

  const {
    name,
    description,
    type,
    breed,
    sex,
    age_months,
    weight_kg,
    size,
    color,
    vaccinated,
    sterilized,
    trained,
    photos,
    status,
    contact_name,
    contact_phone,
    contact_email,
    contact_instagram,
    contact_telegram,
    contact_facebook,
    contact_location,
  } = body;

  db.prepare(
    `UPDATE animals SET name=?, description=?, type=?, breed=?, sex=?, age_months=?, weight_kg=?, size=?, color=?, vaccinated=?, sterilized=?, trained=?, photos=?, status=?, contact_name=?, contact_phone=?, contact_email=?, contact_instagram=?, contact_telegram=?, contact_facebook=?, contact_location=?, updated_at=datetime('now')
     WHERE id=?`
  ).run(
    name,
    description || null,
    type,
    breed || null,
    sex || null,
    age_months || null,
    weight_kg || null,
    size || null,
    color || null,
    vaccinated ? 1 : 0,
    sterilized ? 1 : 0,
    trained ? 1 : 0,
    JSON.stringify(photos || []),
    status || "available",
    contact_name || null,
    contact_phone || null,
    contact_email || null,
    contact_instagram || null,
    contact_telegram || null,
    contact_facebook || null,
    contact_location || null,
    id
  );

  const updated = db.prepare("SELECT * FROM animals WHERE id = ?").get(id);
  return NextResponse.json(updated);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = getDb();

  const existing = db.prepare("SELECT * FROM animals WHERE id = ?").get(id);
  if (!existing) {
    return NextResponse.json({ error: "Тварину не знайдено" }, { status: 404 });
  }

  db.prepare("DELETE FROM animals WHERE id = ?").run(id);
  return NextResponse.json({ success: true });
}
