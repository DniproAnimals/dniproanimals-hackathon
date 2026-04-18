import { z } from "zod";
import { commaSeparatedArraySchema } from "../../../shared/schemas";
import {
  animalModel,
  animalSexSchema,
  animalSizeSchema,
  animalStatusSchema,
  animalTypeSchema,
} from "../models";

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
  orgId: z.coerce.number().nullish(),
  type: animalTypeSchema.nullish(),
  sex: animalSexSchema.nullish(),
  size: animalSizeSchema.nullish(),
  vaccinated: z.boolean().nullish(),
  sterilized: z.boolean().nullish(),
  trained: z.boolean().nullish(),
  status: animalStatusSchema.nullish(),
  breed: commaSeparatedArraySchema().nullish(),
  color: commaSeparatedArraySchema().nullish(),
  q: z.string().nullish(),
  sort: listAnimalsSortSchema.nullish(),
});

export type ListAnimalsQuery = z.infer<typeof listAnimalsQuerySchema>;

export const listAnimalsResponseSchema = z.array(animalModel);
export type ListAnimalsResponse = z.infer<typeof listAnimalsResponseSchema>;
