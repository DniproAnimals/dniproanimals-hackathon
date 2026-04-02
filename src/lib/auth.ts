import { cookies } from "next/headers";
import getDb, { type User } from "./db";

const SESSION_COOKIE = "da_session";

export async function getSession(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sessionId) return null;

  const db = getDb();
  const user = db
    .prepare("SELECT * FROM users WHERE id = ?")
    .get(sessionId) as User | undefined;
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
