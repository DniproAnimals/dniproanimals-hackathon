import { db, eq, usersTable } from "@dniproanimals/database";
import bcrypt from "bcryptjs";
import { googleService } from "../google";

const ROUNDS = 10;

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
    const payload = await googleService.verifyIdToken(idToken);
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
