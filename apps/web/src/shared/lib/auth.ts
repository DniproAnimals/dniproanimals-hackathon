import { env } from "@dniproanimals/env";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const SESSION_COOKIE = "da_session";

export async function getSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sessionId) return null;

  const supabase = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
  );
  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("id", Number(sessionId))
    .single();

  return user || null;
}

export function setSessionCookie(userId: number) {
  return {
    name: SESSION_COOKIE,
    value: String(userId),
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  };
}

export function clearSessionCookie() {
  return {
    name: SESSION_COOKIE,
    value: "",
    httpOnly: true,
    path: "/",
    maxAge: 0,
  };
}
