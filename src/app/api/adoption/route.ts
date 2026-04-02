import { NextRequest, NextResponse } from "next/server";
import getDb from "@/lib/db";

export async function GET() {
  const db = getDb();
  const requests = db
    .prepare(
      `SELECT ar.*, a.name as animal_name, a.type as animal_type
       FROM adoption_requests ar
       JOIN animals a ON ar.animal_id = a.id
       ORDER BY ar.created_at DESC`
    )
    .all();
  return NextResponse.json(requests);
}

export async function POST(request: NextRequest) {
  const db = getDb();
  const body = await request.json();
  const { animal_id, name, email, phone, instagram, telegram, facebook, location, message } = body;

  if (!animal_id || !name || !email || !phone) {
    return NextResponse.json(
      { error: "Всі обов'язкові поля мають бути заповнені" },
      { status: 400 }
    );
  }

  const animal = db
    .prepare("SELECT * FROM animals WHERE id = ?")
    .get(animal_id);
  if (!animal) {
    return NextResponse.json({ error: "Тварину не знайдено" }, { status: 404 });
  }

  const result = db
    .prepare(
      `INSERT INTO adoption_requests (animal_id, name, email, phone, instagram, telegram, facebook, location, message)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(animal_id, name, email, phone, instagram || null, telegram || null, facebook || null, location || null, message || null);

  return NextResponse.json(
    { id: result.lastInsertRowid, success: true },
    { status: 201 }
  );
}
