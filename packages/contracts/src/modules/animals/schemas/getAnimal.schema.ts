import { z } from "zod";
import { animalWithOrgModel } from "../models";

export const getAnimalParamsSchema = z.object({
  id: z.coerce.number(),
});
export type GetAnimalParams = z.infer<typeof getAnimalParamsSchema>;

export const getAnimalResponseSchema = animalWithOrgModel;
export type GetAnimalResponse = z.infer<typeof getAnimalResponseSchema>;
