import { NextRequest, NextResponse } from "next/server";
import getDb from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = getDb();
  const org = db.prepare("SELECT * FROM organizations WHERE id = ?").get(id);
  if (!org) return NextResponse.json(null, { status: 404 });
  return NextResponse.json(org);
}
