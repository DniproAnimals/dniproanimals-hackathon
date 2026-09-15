import type { UpdateBankDetailsBody } from "@dniproanimals/contracts";
import { bankDetailsTable, db, eq } from "@dniproanimals/database";

export const bankDetailsService = {
  async get() {
    const [row] = await db.select().from(bankDetailsTable).limit(1);
    return row ?? null;
  },

  async update(body: UpdateBankDetailsBody) {
    const current = await this.get();
    if (!current) {
      await db.insert(bankDetailsTable).values(body);
    } else {
      await db
        .update(bankDetailsTable)
        .set({ ...body, updatedAt: new Date() })
        .where(eq(bankDetailsTable.id, current.id));
    }
    return { success: true };
  },
};
