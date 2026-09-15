import { z } from "zod";
import { speciesModel } from "../models/species.model";

export const createSpeciesBodySchema = z.object({
  name: z.string().min(1, "Вкажіть назву виду"),
  breeds: z.array(z.string()).optional(),
});
export type CreateSpeciesBody = z.infer<typeof createSpeciesBodySchema>;

export const createSpeciesResponseSchema = speciesModel;
export type CreateSpeciesResponse = z.infer<typeof createSpeciesResponseSchema>;
