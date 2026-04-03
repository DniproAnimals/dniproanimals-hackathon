import { NextRequest, NextResponse } from "next/server";
import getDb from "@/lib/db";
import { getSession } from "@/lib/auth";

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

export async function PATCH(request: NextRequest) {
  const user = await getSession();
  if (!user || !user.org_id) {
    return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });
  }

  const db = getDb();
  const { id, status } = await request.json();

  if (!id || !["approved", "rejected"].includes(status)) {
    return NextResponse.json({ error: "Невірні дані" }, { status: 400 });
  }

  db.prepare("UPDATE adoption_requests SET status = ? WHERE id = ?").run(status, id);
  return NextResponse.json({ success: true });
}
