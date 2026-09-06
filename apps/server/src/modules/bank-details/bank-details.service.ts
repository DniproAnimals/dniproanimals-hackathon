import { bankDetailsTable, db } from "@dniproanimals/database";

export const bankDetailsService = {
  async get() {
    const [row] = await db.select().from(bankDetailsTable).limit(1);
    return row ?? null;
  },
};
