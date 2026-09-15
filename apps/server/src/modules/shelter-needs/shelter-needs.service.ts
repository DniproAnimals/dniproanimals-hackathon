import type { UpdateShelterNeedsBody } from "@dniproanimals/contracts";
import { db, eq, shelterNeedsTable } from "@dniproanimals/database";

export const shelterNeedsService = {
  async get() {
    const [row] = await db.select().from(shelterNeedsTable).limit(1);
    return row ?? null;
  },

  async update(body: UpdateShelterNeedsBody) {
    const current = await this.get();
    if (!current) {
      await db.insert(shelterNeedsTable).values(body);
    } else {
      await db
        .update(shelterNeedsTable)
        .set({ cards: body.cards, updatedAt: new Date() })
        .where(eq(shelterNeedsTable.id, current.id));
    }
    return { success: true };
  },
};
