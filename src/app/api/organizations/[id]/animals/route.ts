import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: animals } = await supabase
    .from("animals")
    .select("*")
    .eq("org_id", Number(id))
    .order("created_at", { ascending: false });

  return NextResponse.json(animals || []);
}
