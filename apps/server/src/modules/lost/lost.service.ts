import type {
  CreateLostBody,
  LostType,
  UpdateLostBody,
} from "@dniproanimals/contracts";
import { and, db, desc, eq, lostAnimalsTable } from "@dniproanimals/database";

type LostInsert = typeof lostAnimalsTable.$inferInsert;

export const lostService = {
  async list(type?: LostType) {
    const filters = [eq(lostAnimalsTable.resolved, false)];
    if (type) filters.push(eq(lostAnimalsTable.type, type));
    return db
      .select()
      .from(lostAnimalsTable)
      .where(and(...filters))
      .orderBy(desc(lostAnimalsTable.createdAt));
  },

  async exists(id: number) {
    const [row] = await db
      .select({ id: lostAnimalsTable.id })
      .from(lostAnimalsTable)
      .where(eq(lostAnimalsTable.id, id))
      .limit(1);
    return !!row;
  },

  async create(body: CreateLostBody) {
    const insert: LostInsert = {
      title: body.title,
      description: body.description,
      type: body.type,
      animalType: body.animalType ?? null,
      breed: body.breed ?? null,
      sex: body.sex ?? null,
      color: body.color ?? null,
      size: body.size ?? null,
      location: body.location ?? null,
      lastSeenLocation: body.lastSeenLocation ?? null,
      lastSeenDate: body.lastSeenDate ?? null,
      contactName: body.contactName,
      contactPhone: body.contactPhone,
      photos: JSON.stringify(body.photos ?? []),
    };
    const [created] = await db
      .insert(lostAnimalsTable)
      .values(insert)
      .returning({ id: lostAnimalsTable.id });
    return created!;
  },

  async update(id: number, body: UpdateLostBody) {
    const patch: Partial<LostInsert> = {};
    if (body.title !== undefined) patch.title = body.title;
    if (body.description !== undefined) patch.description = body.description;
    if (body.type !== undefined) patch.type = body.type;
    if (body.animalType !== undefined)
      patch.animalType = body.animalType ?? null;
    if (body.breed !== undefined) patch.breed = body.breed ?? null;
    if (body.sex !== undefined) patch.sex = body.sex ?? null;
    if (body.color !== undefined) patch.color = body.color ?? null;
    if (body.size !== undefined) patch.size = body.size ?? null;
    if (body.location !== undefined) patch.location = body.location ?? null;
    if (body.lastSeenLocation !== undefined)
      patch.lastSeenLocation = body.lastSeenLocation ?? null;
    if (body.lastSeenDate !== undefined)
      patch.lastSeenDate = body.lastSeenDate ?? null;
    if (body.contactName !== undefined) patch.contactName = body.contactName;
    if (body.contactPhone !== undefined) patch.contactPhone = body.contactPhone;
    if (body.photos !== undefined) patch.photos = JSON.stringify(body.photos);

    const [updated] = await db
      .update(lostAnimalsTable)
      .set(patch)
      .where(eq(lostAnimalsTable.id, id))
      .returning();
    return updated ?? null;
  },
};
