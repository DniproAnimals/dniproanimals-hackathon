import type {
  CreateVolunteerBody,
  ListVolunteersQuery,
  UpdateVolunteerBody,
} from "@dniproanimals/contracts";
import {
  and,
  db,
  desc,
  eq,
  ilike,
  isNotNull,
  isNull,
  or,
  organizationsTable,
  sql,
  volunteersTable,
} from "@dniproanimals/database";
import crypto from "node:crypto";

type VolunteerInsert = typeof volunteersTable.$inferInsert;

export const volunteersService = {
  async listByOrg(orgId: number, filters: ListVolunteersQuery = {}) {
    const conditions = [eq(volunteersTable.orgId, orgId)];

    if (filters.q) {
      const like = `%${filters.q}%`;
      const searchClause = or(
        ilike(volunteersTable.name, like),
        ilike(volunteersTable.surname, like),
        ilike(volunteersTable.email, like),
      );
      if (searchClause) conditions.push(searchClause);
    }

    if (filters.status === "active") {
      conditions.push(isNotNull(volunteersTable.userId));
    } else if (filters.status === "pending") {
      conditions.push(isNull(volunteersTable.userId));
    }

    return db
      .select()
      .from(volunteersTable)
      .where(and(...conditions))
      .orderBy(desc(volunteersTable.createdAt));
  },

  async statsByOrg(orgId: number) {
    const [row] = await db
      .select({
        total: sql<number>`count(*)::int`,
        active: sql<number>`count(*) filter (where ${volunteersTable.userId} is not null)::int`,
        pending: sql<number>`count(*) filter (where ${volunteersTable.userId} is null)::int`,
      })
      .from(volunteersTable)
      .where(eq(volunteersTable.orgId, orgId));
    return {
      total: row?.total ?? 0,
      active: row?.active ?? 0,
      pending: row?.pending ?? 0,
    };
  },

  async create(orgId: number, body: CreateVolunteerBody) {
    const inviteToken = crypto.randomBytes(24).toString("hex");
    const insert: VolunteerInsert = {
      orgId,
      name: body.name,
      surname: body.surname ?? null,
      photo: body.photo ?? null,
      description: body.description ?? null,
      phone: body.phone ?? null,
      email: body.email ?? null,
      instagram: body.instagram ?? null,
      telegram: body.telegram ?? null,
      inviteToken,
    };
    const [created] = await db
      .insert(volunteersTable)
      .values(insert)
      .returning({ id: volunteersTable.id });
    return { id: created!.id, inviteToken };
  },

  async update(orgId: number, body: UpdateVolunteerBody) {
    await db
      .update(volunteersTable)
      .set({
        name: body.name,
        surname: body.surname ?? null,
        photo: body.photo ?? null,
        description: body.description ?? null,
        phone: body.phone ?? null,
        email: body.email ?? null,
        instagram: body.instagram ?? null,
        telegram: body.telegram ?? null,
      })
      .where(
        and(eq(volunteersTable.id, body.id), eq(volunteersTable.orgId, orgId)),
      );
  },

  async delete(orgId: number, id: number) {
    const [row] = await db
      .select({ userId: volunteersTable.userId })
      .from(volunteersTable)
      .where(and(eq(volunteersTable.id, id), eq(volunteersTable.orgId, orgId)))
      .limit(1);
    const userId = row?.userId ?? null;
    await db
      .delete(volunteersTable)
      .where(and(eq(volunteersTable.id, id), eq(volunteersTable.orgId, orgId)));
    return { userId };
  },

  async findByInviteToken(token: string) {
    const [row] = await db
      .select({
        volunteer: volunteersTable,
        orgName: organizationsTable.name,
      })
      .from(volunteersTable)
      .leftJoin(
        organizationsTable,
        eq(volunteersTable.orgId, organizationsTable.id),
      )
      .where(eq(volunteersTable.inviteToken, token))
      .limit(1);
    return row ?? null;
  },

  async claim(id: number, userId: number) {
    await db
      .update(volunteersTable)
      .set({ userId })
      .where(eq(volunteersTable.id, id));
  },
};
