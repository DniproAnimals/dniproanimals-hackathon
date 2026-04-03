import { NextRequest, NextResponse } from "next/server";
import getDb from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function PUT(request: NextRequest) {
  const user = await getSession();
  if (!user || user.role !== "superadmin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const db = getDb();
  const { id, status } = await request.json();
  db.prepare("UPDATE organizations SET status = ? WHERE id = ?").run(status, id);
  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const user = await getSession();
  if (!user || user.role !== "superadmin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const db = getDb();
  const { id } = await request.json();

  // Reset owner role
  const org = db.prepare("SELECT owner_id FROM organizations WHERE id = ?").get(id) as { owner_id: number } | undefined;
  if (org) {
    db.prepare("UPDATE users SET role = 'user', org_id = NULL WHERE org_id = ?").run(id);
  }

  // Delete volunteers
  db.prepare("DELETE FROM volunteers WHERE org_id = ?").run(id);

  // Delete org
  db.prepare("DELETE FROM organizations WHERE id = ?").run(id);

  return NextResponse.json({ success: true });
}
