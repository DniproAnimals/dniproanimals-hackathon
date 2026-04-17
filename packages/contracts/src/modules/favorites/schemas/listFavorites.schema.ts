import { z } from "zod";
import { animalModel } from "../../animals";

export const listFavoritesResponseSchema = z.array(animalModel);
export type ListFavoritesResponse = z.infer<typeof listFavoritesResponseSchema>;
