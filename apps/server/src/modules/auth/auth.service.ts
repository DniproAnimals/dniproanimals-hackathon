import { db, eq, usersTable } from "@dniproanimals/database";
import bcrypt from "bcryptjs";

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

    if (!user) return null;

    const ok = await bcrypt.compare(input.password, user.passwordHash);
    if (!ok) return null;

    return user;
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
