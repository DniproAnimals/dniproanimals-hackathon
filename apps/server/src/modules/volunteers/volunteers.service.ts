import type {
  CreateVolunteerBody,
  UpdateVolunteerBody,
} from "@dniproanimals/contracts";
import {
  and,
  db,
  desc,
  eq,
  organizationsTable,
  volunteersTable,
} from "@dniproanimals/database";
import crypto from "node:crypto";

type VolunteerInsert = typeof volunteersTable.$inferInsert;

export const volunteersService = {
  async listByOrg(orgId: number) {
    return db
      .select()
      .from(volunteersTable)
      .where(eq(volunteersTable.orgId, orgId))
      .orderBy(desc(volunteersTable.createdAt));
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
