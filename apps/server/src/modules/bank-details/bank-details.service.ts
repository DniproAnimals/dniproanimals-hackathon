import { bankDetailsTable, db, desc } from "@dniproanimals/database";

export const bankDetailsService = {
  async get() {
    const [row] = await db
      .select()
      .from(bankDetailsTable)
      .orderBy(desc(bankDetailsTable.updatedAt))
      .limit(1);
    return row ?? null;
  },
};
