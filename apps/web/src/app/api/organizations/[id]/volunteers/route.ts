import { createClient } from "@/shared/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: result } = await supabase
    .from("volunteers")
    .select("*")
    .eq("org_id", Number(id))
    .order("created_at", { ascending: false });

  return NextResponse.json(result || []);
}
