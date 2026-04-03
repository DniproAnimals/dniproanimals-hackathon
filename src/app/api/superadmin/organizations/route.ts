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

  // Delete all user accounts linked to this org (owner + volunteers)
  db.prepare("DELETE FROM users WHERE org_id = ?").run(id);

  // Delete volunteers
  db.prepare("DELETE FROM volunteers WHERE org_id = ?").run(id);

  // Delete notifications
  db.prepare("DELETE FROM notifications WHERE org_id = ?").run(id);

  // Delete org
  db.prepare("DELETE FROM organizations WHERE id = ?").run(id);

  return NextResponse.json({ success: true });
}
