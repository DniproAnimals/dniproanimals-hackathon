import { z } from "zod";
import { lostAnimalModel, lostTypeSchema } from "../models";

export const listLostQuerySchema = z.object({
  type: lostTypeSchema.optional(),
});
export type ListLostQuery = z.infer<typeof listLostQuerySchema>;

export const listLostResponseSchema = z.array(lostAnimalModel);
export type ListLostResponse = z.infer<typeof listLostResponseSchema>;
