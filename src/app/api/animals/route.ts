import { NextRequest, NextResponse } from "next/server";
import getDb from "@/lib/db";

export async function GET(request: NextRequest) {
  const db = getDb();
  const params = request.nextUrl.searchParams;

  const type = params.get("type");
  const sex = params.get("sex");
  const size = params.get("size");
  const q = params.get("q");
  const vaccinated = params.get("vaccinated");
  const sterilized = params.get("sterilized");
  const trained = params.get("trained");
  const status = params.get("status");

  let query = "SELECT * FROM animals WHERE 1=1";
  const bindings: unknown[] = [];

  // Support comma-separated multi-select
  if (type) {
    const types = type.split(",").filter(Boolean);
    if (types.length === 1) {
      query += " AND type = ?";
      bindings.push(types[0]);
    } else if (types.length > 1) {
      query += ` AND type IN (${types.map(() => "?").join(",")})`;
      bindings.push(...types);
    }
  }
  if (sex) {
    const sexes = sex.split(",").filter(Boolean);
    if (sexes.length === 1) {
      query += " AND sex = ?";
      bindings.push(sexes[0]);
    } else if (sexes.length > 1) {
      query += ` AND sex IN (${sexes.map(() => "?").join(",")})`;
      bindings.push(...sexes);
    }
  }
  if (size) {
    const sizes = size.split(",").filter(Boolean);
    if (sizes.length === 1) {
      query += " AND size = ?";
      bindings.push(sizes[0]);
    } else if (sizes.length > 1) {
      query += ` AND size IN (${sizes.map(() => "?").join(",")})`;
      bindings.push(...sizes);
    }
  }
  if (vaccinated === "1") {
    query += " AND vaccinated = 1";
  }
  if (sterilized === "1") {
    query += " AND sterilized = 1";
  }
  if (trained === "1") {
    query += " AND trained = 1";
  }
  if (status) {
    query += " AND status = ?";
    bindings.push(status);
  }
  if (q) {
    query += " AND (name LIKE ? OR breed LIKE ? OR description LIKE ?)";
    const like = `%${q}%`;
    bindings.push(like, like, like);
  }

  const sort = params.get("sort");
  switch (sort) {
    case "name_asc":
      query += " ORDER BY name ASC";
      break;
    case "name_desc":
      query += " ORDER BY name DESC";
      break;
    case "age_asc":
      query += " ORDER BY age_months ASC";
      break;
    case "age_desc":
      query += " ORDER BY age_months DESC";
      break;
    case "oldest":
      query += " ORDER BY created_at ASC";
      break;
    case "weight_asc":
      query += " ORDER BY weight_kg ASC";
      break;
    case "weight_desc":
      query += " ORDER BY weight_kg DESC";
      break;
    default:
      query += " ORDER BY created_at DESC";
  }

  const animals = db.prepare(query).all(...bindings);
  return NextResponse.json(animals);
}

export async function POST(request: NextRequest) {
  const db = getDb();
  const body = await request.json();

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

  if (!name || !type) {
    return NextResponse.json(
      { error: "Ім'я та вид тварини обов'язкові" },
      { status: 400 }
    );
  }

  const result = db
    .prepare(
      `INSERT INTO animals (name, description, type, breed, sex, age_months, weight_kg, size, color, vaccinated, sterilized, trained, photos, status, contact_name, contact_phone, contact_email, contact_instagram, contact_telegram, contact_facebook, contact_location)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
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
    );

  const animal = db
    .prepare("SELECT * FROM animals WHERE id = ?")
    .get(result.lastInsertRowid);

  return NextResponse.json(animal, { status: 201 });
}
