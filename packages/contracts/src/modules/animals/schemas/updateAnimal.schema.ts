import { z } from "zod";
import { animalModel } from "../models";
import { createAnimalBodySchema } from "./createAnimal.schema";

export const updateAnimalParamsSchema = z.object({
  id: z.coerce.number(),
});
export type UpdateAnimalParams = z.infer<typeof updateAnimalParamsSchema>;

export const updateAnimalBodySchema = createAnimalBodySchema.partial();
export type UpdateAnimalBody = z.infer<typeof updateAnimalBodySchema>;

export const updateAnimalResponseSchema = animalModel;
export type UpdateAnimalResponse = z.infer<typeof updateAnimalResponseSchema>;
