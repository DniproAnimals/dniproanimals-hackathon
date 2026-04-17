import {
  and,
  animalsTable,
  db,
  desc,
  eq,
  favoritesTable,
} from "@dniproanimals/database";

export const favoritesService = {
  async listByUser(userId: number) {
    const rows = await db
      .select({ animal: animalsTable })
      .from(favoritesTable)
      .innerJoin(animalsTable, eq(favoritesTable.animalId, animalsTable.id))
      .where(eq(favoritesTable.userId, userId))
      .orderBy(desc(favoritesTable.createdAt));
    return rows.map((r) => r.animal);
  },

  async toggle(userId: number, animalId: number) {
    const [existing] = await db
      .select({ id: favoritesTable.id })
      .from(favoritesTable)
      .where(
        and(
          eq(favoritesTable.userId, userId),
          eq(favoritesTable.animalId, animalId),
        ),
      )
      .limit(1);

    if (existing) {
      await db
        .delete(favoritesTable)
        .where(
          and(
            eq(favoritesTable.userId, userId),
            eq(favoritesTable.animalId, animalId),
          ),
        );
      return false;
    }

    await db.insert(favoritesTable).values({ userId, animalId });
    return true;
  },
};
