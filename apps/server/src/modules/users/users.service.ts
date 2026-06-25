import { db, eq, usersTable } from "@dniproanimals/database";

type UserUpdate = Partial<typeof usersTable.$inferInsert>;

export const usersService = {
  async getById(id: number) {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id))
      .limit(1);
    return user ?? null;
  },

  async getByEmail(email: string) {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);
    return user ?? null;
  },

  async update(id: number, patch: UserUpdate) {
    await db.update(usersTable).set(patch).where(eq(usersTable.id, id));
  },

  async list() {
    return db.select().from(usersTable).orderBy(usersTable.id);
  },

  async updateRole(
    id: number,
    role: "user" | "admin" | "volunteer" | "superadmin",
  ) {
    await db.update(usersTable).set({ role }).where(eq(usersTable.id, id));
    return { success: true };
  },
};
