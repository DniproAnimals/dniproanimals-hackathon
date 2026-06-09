import type {
  CreateAdoptionBody,
  ListAdoptionQuery,
} from "@dniproanimals/contracts";
import {
  adoptionRequestsTable,
  animalsTable,
  db,
  desc,
  eq,
  sql,
} from "@dniproanimals/database";

type AdoptionInsert = typeof adoptionRequestsTable.$inferInsert;

export const adoptionService = {
  async list(filters: ListAdoptionQuery = {}) {
    const rows = await db
      .select({
        request: adoptionRequestsTable,
        animal: {
          name: animalsTable.name,
          type: animalsTable.type,
        },
      })
      .from(adoptionRequestsTable)
      .leftJoin(
        animalsTable,
        eq(adoptionRequestsTable.animalId, animalsTable.id),
      )
      .orderBy(desc(adoptionRequestsTable.createdAt));

    const q = filters.q?.toLowerCase();

    const filtered = rows
      .filter((r) =>
        filters.status ? r.request.status === filters.status : true,
      )
      .filter((r) => {
        if (!q) return true;
        const hay =
          `${r.request.name} ${r.request.email} ${r.animal?.name ?? ""}`.toLowerCase();
        return hay.includes(q);
      })
      .map((r) => ({
        ...r.request,
        animalName: r.animal?.name ?? null,
        animalType: r.animal?.type ?? null,
      }));

    return filters.limit ? filtered.slice(0, filters.limit) : filtered;
  },

  async stats() {
    const [row] = await db
      .select({
        total: sql<number>`count(*)::int`,
        pending: sql<number>`count(*) filter (where ${adoptionRequestsTable.status} = 'pending')::int`,
        approved: sql<number>`count(*) filter (where ${adoptionRequestsTable.status} = 'approved')::int`,
        rejected: sql<number>`count(*) filter (where ${adoptionRequestsTable.status} = 'rejected')::int`,
      })
      .from(adoptionRequestsTable);
    return {
      total: row?.total ?? 0,
      pending: row?.pending ?? 0,
      approved: row?.approved ?? 0,
      rejected: row?.rejected ?? 0,
    };
  },

  async create(body: CreateAdoptionBody) {
    const insert: AdoptionInsert = {
      animalId: body.animalId,
      name: body.name,
      email: body.email,
      phone: body.phone,
      instagram: body.instagram ?? null,
      telegram: body.telegram ?? null,
      facebook: body.facebook ?? null,
      location: body.location ?? null,
      message: body.message ?? null,
    };
    const [created] = await db
      .insert(adoptionRequestsTable)
      .values(insert)
      .returning({ id: adoptionRequestsTable.id });
    return created!;
  },

  async updateStatus(id: number, status: "approved" | "rejected") {
    await db
      .update(adoptionRequestsTable)
      .set({ status })
      .where(eq(adoptionRequestsTable.id, id));
  },

  async getAnimalId(id: number) {
    const [row] = await db
      .select({ animalId: adoptionRequestsTable.animalId })
      .from(adoptionRequestsTable)
      .where(eq(adoptionRequestsTable.id, id))
      .limit(1);
    return row?.animalId ?? null;
  },
};
