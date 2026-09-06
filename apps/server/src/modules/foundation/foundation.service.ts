import type { UpdateFoundationBody } from "@dniproanimals/contracts";
import {
  DEFAULT_FOUNDATION_VALUES,
  db,
  eq,
  foundationTable,
} from "@dniproanimals/database";

export const foundationService = {
  async get() {
    const [row] = await db.select().from(foundationTable).limit(1);
    if (!row) {
      const [newRow] = await db
        .insert(foundationTable)
        .values(DEFAULT_FOUNDATION_VALUES)
        .returning();
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
