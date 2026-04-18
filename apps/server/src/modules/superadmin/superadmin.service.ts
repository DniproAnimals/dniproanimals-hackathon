import type { SuperadminListOrgsQuery } from "@dniproanimals/contracts";
import {
  and,
  db,
  desc,
  eq,
  notificationsTable,
  organizationsTable,
  sql,
  usersTable,
  volunteersTable,
} from "@dniproanimals/database";

export const superadminService = {
  async listOrgs(filters: SuperadminListOrgsQuery = {}) {
    const conditions = [];
    if (filters.status) {
      conditions.push(eq(organizationsTable.status, filters.status));
    }
    const where = conditions.length ? and(...conditions) : undefined;
    return db
      .select()
      .from(organizationsTable)
      .where(where)
      .orderBy(desc(organizationsTable.createdAt));
  },

  async orgsStats() {
    const [row] = await db
      .select({
        total: sql<number>`count(*)::int`,
        pending: sql<number>`count(*) filter (where ${organizationsTable.status} = 'pending')::int`,
        approved: sql<number>`count(*) filter (where ${organizationsTable.status} = 'approved')::int`,
        rejected: sql<number>`count(*) filter (where ${organizationsTable.status} = 'rejected')::int`,
      })
      .from(organizationsTable);
    return {
      total: row?.total ?? 0,
      pending: row?.pending ?? 0,
      approved: row?.approved ?? 0,
      rejected: row?.rejected ?? 0,
    };
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
