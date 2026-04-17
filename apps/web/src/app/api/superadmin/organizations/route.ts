import { getSession } from "@/shared/lib/auth";
import { createClient } from "@/shared/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  const user = await getSession();
  if (!user || user.role !== "superadmin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const supabase = await createClient();
  const { id, status } = await request.json();
  await supabase.from("organizations").update({ status }).eq("id", id);
  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const user = await getSession();
  if (!user || user.role !== "superadmin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const supabase = await createClient();
  const { id } = await request.json();

  await supabase.from("users").delete().eq("org_id", id);
  await supabase.from("volunteers").delete().eq("org_id", id);
  await supabase.from("notifications").delete().eq("org_id", id);
  await supabase.from("organizations").delete().eq("id", id);

  return NextResponse.json({ success: true });
}
