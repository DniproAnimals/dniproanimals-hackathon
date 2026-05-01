import { db, eq, usersTable } from "@dniproanimals/database";
import { env } from "@dniproanimals/env";
import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";

const ROUNDS = 10;
const googleClient = new OAuth2Client(env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

export const authService = {
  async register(input: { name: string; email: string; password: string }) {
    const existing = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, input.email))
      .limit(1);

    if (existing[0]) return null;

    const passwordHash = await bcrypt.hash(input.password, ROUNDS);
    const [user] = await db
      .insert(usersTable)
      .values({
        name: input.name,
        email: input.email,
        passwordHash,
      })
      .returning();

    return user ?? null;
  },

  async login(input: { email: string; password: string }) {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, input.email))
      .limit(1);

    if (!user || !user.passwordHash) return null;

    const ok = await bcrypt.compare(input.password, user.passwordHash);
    if (!ok) return null;

    return user;
  },

  async loginWithGoogleIdToken(idToken: string) {
    let payload: {
      sub?: string | null;
      email?: string | null;
      name?: string | null;
      picture?: string | null;
    } | null = null;

    try {
      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload() ?? null;
    } catch {
      return null;
    }

    if (!payload?.sub || !payload.email) return null;

    const email = payload.email.toLowerCase();
    const googleId = payload.sub;
    const name = payload.name ?? email.split("@")[0] ?? "User";
    const photo = payload.picture ?? null;

    const [byGoogle] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.googleId, googleId))
      .limit(1);

    if (byGoogle) return byGoogle;

    const [byEmail] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    if (byEmail) {
      const [updated] = await db
        .update(usersTable)
        .set({
          googleId,
          photo: byEmail.photo ?? photo,
          name: byEmail.name ?? name,
        })
        .where(eq(usersTable.id, byEmail.id))
        .returning();

      return updated ?? byEmail;
    }

    const [created] = await db
      .insert(usersTable)
      .values({
        name,
        email,
        passwordHash: null,
        googleId,
        photo,
      })
      .returning();

    return created ?? null;
  },

  async getById(id: number) {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id))
      .limit(1);

    return user ?? null;
  },
};
