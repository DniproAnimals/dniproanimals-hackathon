import { clearSessionCookie } from "@/shared/lib/auth";
import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.set(clearSessionCookie());
  return res;
}
