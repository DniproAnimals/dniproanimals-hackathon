import {
  db,
  desc,
  eq,
  notificationsTable,
  organizationsTable,
  usersTable,
  volunteersTable,
} from "@dniproanimals/database";

export const superadminService = {
  async listOrgs() {
    return db
      .select()
      .from(organizationsTable)
      .orderBy(desc(organizationsTable.createdAt));
  },

  async updateOrgStatus(
    id: number,
    status: "pending" | "approved" | "rejected",
  ) {
    await db
      .update(organizationsTable)
      .set({ status })
      .where(eq(organizationsTable.id, id));
  },

  async deleteOrg(id: number) {
    await db.delete(usersTable).where(eq(usersTable.orgId, id));
    await db.delete(volunteersTable).where(eq(volunteersTable.orgId, id));
    await db.delete(notificationsTable).where(eq(notificationsTable.orgId, id));
    await db.delete(organizationsTable).where(eq(organizationsTable.id, id));
  },
};
