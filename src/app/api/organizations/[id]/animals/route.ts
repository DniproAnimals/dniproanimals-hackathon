import { NextRequest, NextResponse } from "next/server";
import getDb from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = getDb();
  // Get animals where contact_location matches org or where the animal was added by org users
  // For now, get all animals from users belonging to this org
  const animals = db.prepare(
    `SELECT a.* FROM animals a
     JOIN users u ON (a.contact_email = u.email OR a.contact_phone = u.phone)
     WHERE u.org_id = ?
     UNION
     SELECT a.* FROM animals a
     WHERE a.id IN (
       SELECT animal_id FROM (
         SELECT a2.id as animal_id FROM animals a2
         WHERE a2.contact_location LIKE '%' || (SELECT location FROM organizations WHERE id = ?) || '%'
       )
     )
     ORDER BY created_at DESC`
  ).all(id, id);

  // Fallback: just return all animals for demo
  if (animals.length === 0) {
    const allAnimals = db.prepare("SELECT * FROM animals ORDER BY created_at DESC LIMIT 8").all();
    return NextResponse.json(allAnimals);
  }

  return NextResponse.json(animals);
}
