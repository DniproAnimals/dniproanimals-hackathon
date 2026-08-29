import { z } from "zod";

export const breedModel = z.object({
  id: z.number(),
  name: z.string(),
  speciesId: z.number(),
  createdAt: z.string(),
});
export type Breed = z.infer<typeof breedModel>;

export const speciesModel = z.object({
  id: z.number(),
  name: z.string(),
  value: z.string(),
  createdAt: z.string(),
  breeds: z.array(breedModel).optional(),
});
export type Species = z.infer<typeof speciesModel>;
