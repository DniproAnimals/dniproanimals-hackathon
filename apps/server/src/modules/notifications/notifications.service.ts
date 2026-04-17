import { db, desc, notificationsTable } from "@dniproanimals/database";

type NotificationInsert = typeof notificationsTable.$inferInsert;

export const notificationsService = {
  async list(limit = 50) {
    return db
      .select()
      .from(notificationsTable)
      .orderBy(desc(notificationsTable.createdAt))
      .limit(limit);
  },

  async create(payload: NotificationInsert) {
    await db.insert(notificationsTable).values(payload);
  },
};
