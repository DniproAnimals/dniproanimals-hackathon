import type { UpdateContractTemplateBody } from "@dniproanimals/contracts";
import { contractTemplates, db, desc, eq } from "@dniproanimals/database";

export const contractTemplateService = {
  async getActive(type: string) {
    const [row] = await db
      .select()
      .from(contractTemplates)
      .where(eq(contractTemplates.type, type))
      .orderBy(desc(contractTemplates.version))
      .limit(1);

    return row ?? null;
  },

  async update(
    type: string,
    data: UpdateContractTemplateBody,
    updatedBy: number,
  ) {
    const current = await this.getActive(type);

    if (!current) {
      const [created] = await db
        .insert(contractTemplates)
        .values({
          type,
          title: data.title,
          subtitle: data.subtitle ?? null,
          content: data.content,
          updatedBy,
        })
        .returning();

      return created ?? null;
    }

    const [updated] = await db
      .update(contractTemplates)
      .set({
        title: data.title,
        subtitle: data.subtitle ?? null,
        content: data.content,
        version: current.version + 1,
        updatedBy,
        updatedAt: new Date(),
      })
      .where(eq(contractTemplates.id, current.id))
      .returning();

    return updated ?? null;
  },
};
