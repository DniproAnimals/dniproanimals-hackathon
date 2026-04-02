import { NextRequest, NextResponse } from "next/server";
import getDb from "@/lib/db";

export async function GET(request: NextRequest) {
  const db = getDb();
  const type = request.nextUrl.searchParams.get("type");

  let query = "SELECT * FROM lost_animals WHERE resolved = 0";
  const bindings: unknown[] = [];

  if (type) {
    query += " AND type = ?";
    bindings.push(type);
  }

  query += " ORDER BY created_at DESC";
  const items = db.prepare(query).all(...bindings);
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  const db = getDb();
  const body = await request.json();
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

  if (!title || !description || !type || !contact_name || !contact_phone) {
    return NextResponse.json(
      { error: "Всі обов'язкові поля мають бути заповнені" },
      { status: 400 }
    );
  }

  const result = db
    .prepare(
      `INSERT INTO lost_animals (title, description, type, animal_type, breed, sex, color, size, location, last_seen_location, last_seen_date, contact_name, contact_phone, photos)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      title,
      description,
      type,
      animal_type || null,
      breed || null,
      sex || null,
      color || null,
      size || null,
      location || null,
      last_seen_location || null,
      last_seen_date || null,
      contact_name,
      contact_phone,
      JSON.stringify(photos || [])
    );

  return NextResponse.json(
    { id: result.lastInsertRowid, success: true },
    { status: 201 }
  );
}
