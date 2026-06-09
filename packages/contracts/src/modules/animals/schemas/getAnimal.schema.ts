import { z } from "zod";
import { animalModel } from "../models";

export const getAnimalParamsSchema = z.object({
  id: z.coerce.number(),
});
export type GetAnimalParams = z.infer<typeof getAnimalParamsSchema>;

export const getAnimalResponseSchema = animalModel;
export type GetAnimalResponse = z.infer<typeof getAnimalResponseSchema>;
