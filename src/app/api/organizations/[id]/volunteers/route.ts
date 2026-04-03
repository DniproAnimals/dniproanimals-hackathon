import { NextRequest, NextResponse } from "next/server";
import getDb from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = getDb();
  const volunteers = db.prepare("SELECT * FROM volunteers WHERE org_id = ? ORDER BY created_at DESC").all(id);
  return NextResponse.json(volunteers);
}
