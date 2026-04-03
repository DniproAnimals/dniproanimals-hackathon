import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET() {
  const user = await getSession();
  if (!user) {
    return NextResponse.json(null);
  }
  return NextResponse.json({ id: user.id, name: user.name, email: user.email, role: user.role, org_id: user.org_id });
}
