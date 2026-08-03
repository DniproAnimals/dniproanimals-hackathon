import {
  and,
  animalDonationsTable,
  db,
  eq,
  sql,
} from "@dniproanimals/database";

export const animalDonationsService = {
  async getStatus(userId: number, animalId: number) {
    const [donation] = await db
      .select({ active: animalDonationsTable.isActive })
      .from(animalDonationsTable)
      .where(
        and(
          eq(animalDonationsTable.userId, userId),
          eq(animalDonationsTable.animalId, animalId),
        ),
      )
      .limit(1);

    return donation?.active ?? false;
  },

  async start(userId: number, animalId: number) {
    await db
      .insert(animalDonationsTable)
      .values({ userId, animalId })
      .onConflictDoUpdate({
        target: [animalDonationsTable.userId, animalDonationsTable.animalId],
        set: {
          isActive: true,
          startedAt: sql<Date>`case when ${animalDonationsTable.isActive} then ${animalDonationsTable.startedAt} else now() end`,
          canceledAt: null,
          updatedAt: sql<Date>`case when ${animalDonationsTable.isActive} then ${animalDonationsTable.updatedAt} else now() end`,
        },
      });

    return true;
  },

  async cancel(userId: number, animalId: number) {
    await db
      .update(animalDonationsTable)
      .set({
        isActive: false,
        canceledAt: sql<Date>`now()`,
        updatedAt: sql<Date>`now()`,
      })
      .where(
        and(
          eq(animalDonationsTable.userId, userId),
          eq(animalDonationsTable.animalId, animalId),
          eq(animalDonationsTable.isActive, true),
        ),
      );

    return false;
  },
};
