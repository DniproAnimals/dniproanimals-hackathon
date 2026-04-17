import type { CreateAdoptionBody } from "@dniproanimals/contracts";
import {
  adoptionRequestsTable,
  animalsTable,
  db,
  desc,
  eq,
} from "@dniproanimals/database";

type AdoptionInsert = typeof adoptionRequestsTable.$inferInsert;

export const adoptionService = {
  async list(orgId?: number) {
    const rows = await db
      .select({
        request: adoptionRequestsTable,
        animal: {
          name: animalsTable.name,
          type: animalsTable.type,
          orgId: animalsTable.orgId,
        },
      })
      .from(adoptionRequestsTable)
      .leftJoin(
        animalsTable,
        eq(adoptionRequestsTable.animalId, animalsTable.id),
      )
      .orderBy(desc(adoptionRequestsTable.createdAt));

    return rows
      .filter((r) => (orgId ? r.animal?.orgId === orgId : true))
      .map((r) => ({
        ...r.request,
        animalName: r.animal?.name ?? null,
        animalType: r.animal?.type ?? null,
      }));
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
