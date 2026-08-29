import type {
  AddBreedsBody,
  CreateAnimalBody,
  CreateSpeciesBody,
  ListAnimalsQuery,
  ListBreedsQuery,
  UpdateAnimalBody,
} from "@dniproanimals/contracts";
import {
  and,
  animalsTable,
  asc,
  breedsTable,
  db,
  desc,
  eq,
  ilike,
  inArray,
  or,
  speciesTable,
  sql,
} from "@dniproanimals/database";

type AnimalInsert = typeof animalsTable.$inferInsert;

function orderBy(sort: ListAnimalsQuery["sort"]) {
  switch (sort) {
    case "name_asc":
      return asc(animalsTable.name);
    case "name_desc":
      return desc(animalsTable.name);
    case "age_asc":
      return asc(animalsTable.ageMonths);
    case "age_desc":
      return desc(animalsTable.ageMonths);
    case "weight_asc":
      return asc(animalsTable.weightKg);
    case "weight_desc":
      return desc(animalsTable.weightKg);
    case "oldest":
      return asc(animalsTable.createdAt);
    default:
      return desc(animalsTable.createdAt);
  }
}

export const animalsService = {
  async list(query: ListAnimalsQuery) {
    const filters = [];

    if (query.type) filters.push(eq(animalsTable.type, query.type));
    if (query.sex) filters.push(eq(animalsTable.sex, query.sex));
    if (query.size) filters.push(eq(animalsTable.size, query.size));

    if (query.vaccinated === true)
      filters.push(eq(animalsTable.vaccinated, true));
    if (query.sterilized === true)
      filters.push(eq(animalsTable.sterilized, true));
    if (query.trained === true) filters.push(eq(animalsTable.trained, true));
    if (query.status) filters.push(eq(animalsTable.status, query.status));

    const breeds = query.breed ?? [];
    if (breeds.length === 1) filters.push(eq(animalsTable.breed, breeds[0]!));
    else if (breeds.length > 1)
      filters.push(inArray(animalsTable.breed, breeds));

    const colors = query.color ?? [];
    if (colors.length) {
      const colorFilter = or(
        ...colors.map((c) => ilike(animalsTable.color, `%${c}%`)),
      );
      if (colorFilter) filters.push(colorFilter);
    }

    if (query.q) {
      const pattern = `%${query.q}%`;
      const qFilter = or(
        ilike(animalsTable.name, pattern),
        ilike(animalsTable.breed, pattern),
        ilike(animalsTable.description, pattern),
      );
      if (qFilter) filters.push(qFilter);
    }

    const base = db
      .select()
      .from(animalsTable)
      .where(filters.length ? and(...filters) : undefined)
      .orderBy(orderBy(query.sort));
    return query.limit ? base.limit(query.limit) : base;
  },

  async stats() {
    const [row] = await db
      .select({
        total: sql<number>`count(*)::int`,
        available: sql<number>`count(*) filter (where ${animalsTable.status} = 'available')::int`,
        reserved: sql<number>`count(*) filter (where ${animalsTable.status} = 'reserved')::int`,
        adopted: sql<number>`count(*) filter (where ${animalsTable.status} = 'adopted')::int`,
      })
      .from(animalsTable);
    return {
      total: row?.total ?? 0,
      available: row?.available ?? 0,
      reserved: row?.reserved ?? 0,
      adopted: row?.adopted ?? 0,
    };
  },

  async getById(id: number) {
    const [animal] = await db
      .select()
      .from(animalsTable)
      .where(eq(animalsTable.id, id))
      .limit(1);
    return animal ?? null;
  },

  async create(body: CreateAnimalBody) {
    const insert: AnimalInsert = {
      name: body.name,
      description: body.description ?? null,
      type: body.type,
      breed: body.breed ?? null,
      sex: body.sex ?? null,
      ageMonths: body.ageMonths ?? null,
      weightKg: body.weightKg ?? null,
      size: body.size ?? null,
      color: body.color ?? null,
      vaccinated: body.vaccinated ?? undefined,
      sterilized: body.sterilized ?? undefined,
      trained: body.trained ?? undefined,
      donationsEnabled: body.donationsEnabled,
      commands: body.commands ?? null,
      photos: JSON.stringify(body.photos ?? []),
      status: body.status ?? "available",
      contactName: body.contactName ?? null,
      contactPhone: body.contactPhone ?? null,
      contactEmail: body.contactEmail ?? null,
      contactInstagram: body.contactInstagram ?? null,
      contactTelegram: body.contactTelegram ?? null,
      contactFacebook: body.contactFacebook ?? null,
      contactLocation: body.contactLocation ?? null,
    };
    const [created] = await db.insert(animalsTable).values(insert).returning();
    return created!;
  },

  async update(id: number, body: UpdateAnimalBody) {
    const patch: Partial<AnimalInsert> & { updatedAt: Date } = {
      updatedAt: new Date(),
    };
    if (body.name !== undefined) patch.name = body.name;
    if (body.description !== undefined)
      patch.description = body.description ?? null;
    if (body.type !== undefined) patch.type = body.type;
    if (body.breed !== undefined) patch.breed = body.breed ?? null;
    if (body.sex !== undefined) patch.sex = body.sex ?? null;
    if (body.ageMonths !== undefined) patch.ageMonths = body.ageMonths ?? null;
    if (body.weightKg !== undefined) patch.weightKg = body.weightKg ?? null;
    if (body.size !== undefined) patch.size = body.size ?? null;
    if (body.color !== undefined) patch.color = body.color ?? null;
    if (body.vaccinated !== undefined)
      patch.vaccinated = body.vaccinated ?? undefined;
    if (body.sterilized !== undefined)
      patch.sterilized = body.sterilized ?? undefined;
    if (body.trained !== undefined) patch.trained = body.trained ?? undefined;
    if (body.donationsEnabled !== undefined)
      patch.donationsEnabled = body.donationsEnabled;
    if (body.commands !== undefined) patch.commands = body.commands ?? null;
    if (body.photos !== undefined) patch.photos = JSON.stringify(body.photos);
    if (body.status !== undefined) patch.status = body.status;
    if (body.contactName !== undefined)
      patch.contactName = body.contactName ?? null;
    if (body.contactPhone !== undefined)
      patch.contactPhone = body.contactPhone ?? null;
    if (body.contactEmail !== undefined)
      patch.contactEmail = body.contactEmail ?? null;
    if (body.contactInstagram !== undefined)
      patch.contactInstagram = body.contactInstagram ?? null;
    if (body.contactTelegram !== undefined)
      patch.contactTelegram = body.contactTelegram ?? null;
    if (body.contactFacebook !== undefined)
      patch.contactFacebook = body.contactFacebook ?? null;
    if (body.contactLocation !== undefined)
      patch.contactLocation = body.contactLocation ?? null;

    const [updated] = await db
      .update(animalsTable)
      .set(patch)
      .where(eq(animalsTable.id, id))
      .returning();
    return updated ?? null;
  },

  async markAdopted(id: number) {
    await db
      .update(animalsTable)
      .set({ status: "adopted", updatedAt: new Date() })
      .where(eq(animalsTable.id, id));
  },

  async delete(id: number) {
    await db.delete(animalsTable).where(eq(animalsTable.id, id));
  },

  async exists(id: number) {
    const [row] = await db
      .select({ x: sql<number>`1` })
      .from(animalsTable)
      .where(eq(animalsTable.id, id))
      .limit(1);
    return !!row;
  },

  async listSpecies() {
    const species = await db
      .select()
      .from(speciesTable)
      .orderBy(asc(speciesTable.name));
    const result = [];
    for (const s of species) {
      const breeds = await db
        .select()
        .from(breedsTable)
        .where(eq(breedsTable.speciesId, s.id))
        .orderBy(asc(breedsTable.name));
      result.push({
        ...s,
        breeds,
      });
    }
    return result;
  },

  async listBreeds(query?: ListBreedsQuery) {
    if (query?.type) {
      const [species] = await db
        .select()
        .from(speciesTable)
        .where(eq(speciesTable.value, query.type));

      if (!species) return [];

      return db
        .select()
        .from(breedsTable)
        .where(eq(breedsTable.speciesId, species.id))
        .orderBy(asc(breedsTable.name));
    }

    return db.select().from(breedsTable).orderBy(asc(breedsTable.name));
  },

  async createSpecies(body: CreateSpeciesBody) {
    const slug = body.name;
    const [inserted] = await db
      .insert(speciesTable)
      .values({
        name: body.name,
        value: slug,
      })
      .returning();

    const breeds: any[] = [];
    if (body.breeds && body.breeds.length > 0) {
      const uniqueBreeds = Array.from(
        new Set(body.breeds.map((b) => b.trim()).filter(Boolean)),
      );
      for (const bName of uniqueBreeds) {
        const [bInserted] = await db
          .insert(breedsTable)
          .values({
            name: bName,
            speciesId: inserted!.id,
          })
          .returning();
        breeds.push(bInserted!);
      }
    }

    return {
      ...inserted!,
      breeds,
    };
  },

  async addBreeds(body: AddBreedsBody) {
    const uniqueBreeds = Array.from(
      new Set(body.breeds.map((b) => b.trim()).filter(Boolean)),
    );

    let addedCount = 0;
    for (const bName of uniqueBreeds) {
      const [exists] = await db
        .select()
        .from(breedsTable)
        .where(
          and(
            eq(breedsTable.name, bName),
            eq(breedsTable.speciesId, body.speciesId),
          ),
        );

      if (!exists) {
        await db.insert(breedsTable).values({
          name: bName,
          speciesId: body.speciesId,
        });
        addedCount++;
      }
    }

    return { success: true, addedCount };
  },
};
