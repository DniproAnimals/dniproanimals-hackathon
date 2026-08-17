import { z } from "zod";
import { breedModel } from "../models/species.model";

export const listBreedsQuerySchema = z.object({
  type: z.string().nullish(),
});
export type ListBreedsQuery = z.infer<typeof listBreedsQuerySchema>;

export const listBreedsResponseSchema = z.array(breedModel);
export type ListBreedsResponse = z.infer<typeof listBreedsResponseSchema>;
