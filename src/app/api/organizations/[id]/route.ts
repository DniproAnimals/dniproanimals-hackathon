import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: org } = await supabase
    .from("organizations")
    .select("*")
    .eq("id", Number(id))
    .single();

  if (!org) return NextResponse.json(null, { status: 404 });

  const user = await getSession();
  const isSuperadmin = user?.role === "superadmin";
  const isMember = user?.org_id === org.id;
  if (org.status !== "approved" && !isSuperadmin && !isMember) {
    return NextResponse.json(null, { status: 404 });
  }

  return NextResponse.json(org);
}
