import type { UpdateFoundationBody } from "@dniproanimals/contracts";
import { db, eq, foundationTable } from "@dniproanimals/database";

export const foundationService = {
  async get() {
    const [row] = await db.select().from(foundationTable).limit(1);
    if (!row) {
      // Create default if not exists
      const [newRow] = await db.insert(foundationTable).values({}).returning();
      return newRow!;
    }
    return row;
  },

  async update(body: UpdateFoundationBody) {
    const current = await this.get();
    await db
      .update(foundationTable)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(foundationTable.id, current.id));
    return { success: true };
  },
};
