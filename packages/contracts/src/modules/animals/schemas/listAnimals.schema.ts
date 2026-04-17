import { z } from "zod";
import { animalModel, animalStatusSchema } from "../models";

export const listAnimalsSortSchema = z.enum([
  "newest",
  "oldest",
  "name_asc",
  "name_desc",
  "age_asc",
  "age_desc",
  "weight_asc",
  "weight_desc",
]);
export type ListAnimalsSort = z.infer<typeof listAnimalsSortSchema>;

export const listAnimalsQuerySchema = z.object({
  orgId: z.coerce.number().optional(),
  type: z.string().optional(),
  sex: z.string().optional(),
  size: z.string().optional(),
  vaccinated: z.enum(["0", "1"]).optional(),
  sterilized: z.enum(["0", "1"]).optional(),
  trained: z.enum(["0", "1"]).optional(),
  status: animalStatusSchema.optional(),
  breed: z.string().optional(),
  color: z.string().optional(),
  q: z.string().optional(),
  sort: listAnimalsSortSchema.optional(),
});
export type ListAnimalsQuery = z.infer<typeof listAnimalsQuerySchema>;

export const listAnimalsResponseSchema = z.array(animalModel);
export type ListAnimalsResponse = z.infer<typeof listAnimalsResponseSchema>;
