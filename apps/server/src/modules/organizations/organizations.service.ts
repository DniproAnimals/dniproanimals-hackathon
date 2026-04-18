import type {
  CreateOrganizationBody,
  UpdateOwnOrganizationBody,
} from "@dniproanimals/contracts";
import {
  animalsTable,
  db,
  desc,
  eq,
  organizationsTable,
  volunteersTable,
} from "@dniproanimals/database";

type OrgInsert = typeof organizationsTable.$inferInsert;

export const organizationsService = {
  async listApproved() {
    return db
      .select()
      .from(organizationsTable)
      .where(eq(organizationsTable.status, "approved"))
      .orderBy(desc(organizationsTable.createdAt));
  },

  async getById(id: number) {
    const [org] = await db
      .select()
      .from(organizationsTable)
      .where(eq(organizationsTable.id, id))
      .limit(1);
    return org ?? null;
  },

  async animalsByOrg(orgId: number) {
    return db
      .select()
      .from(animalsTable)
      .where(eq(animalsTable.orgId, orgId))
      .orderBy(desc(animalsTable.createdAt));
  },

  async volunteersByOrg(orgId: number) {
    return db
      .select()
      .from(volunteersTable)
      .where(eq(volunteersTable.orgId, orgId))
      .orderBy(desc(volunteersTable.createdAt));
  },

  async create(body: CreateOrganizationBody, ownerId: number) {
    const insert: OrgInsert = {
      name: body.name,
      description: body.description ?? null,
      photo: body.photo ?? null,
      location: body.location ?? null,
      phone: body.phone ?? null,
      email: body.email ?? null,
      instagram: body.instagram ?? null,
      telegram: body.telegram ?? null,
      facebook: body.facebook ?? null,
      website: body.website ?? null,
      ownerId,
    };
    const [created] = await db
      .insert(organizationsTable)
      .values(insert)
      .returning({ id: organizationsTable.id });
    return created!;
  },

  async updateStatus(id: number, status: "pending" | "approved" | "rejected") {
    await db
      .update(organizationsTable)
      .set({ status })
      .where(eq(organizationsTable.id, id));
  },

  async updateOwn(id: number, body: UpdateOwnOrganizationBody) {
    await db
      .update(organizationsTable)
      .set({
        name: body.name,
        description: body.description ?? null,
        photo: body.photo ?? null,
        location: body.location ?? null,
        phone: body.phone ?? null,
        email: body.email ?? null,
        instagram: body.instagram ?? null,
        telegram: body.telegram ?? null,
        facebook: body.facebook ?? null,
        website: body.website ?? null,
      })
      .where(eq(organizationsTable.id, id));
  },

  async updateJar(id: number, monobankJarId: string | null) {
    await db
      .update(organizationsTable)
      .set({ monobankJarId })
      .where(eq(organizationsTable.id, id));
  },
};
