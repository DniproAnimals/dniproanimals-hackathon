import { z } from "zod";

export const toggleFavoriteBodySchema = z.object({
  animalId: z.number(),
});
export type ToggleFavoriteBody = z.infer<typeof toggleFavoriteBodySchema>;

export const toggleFavoriteResponseSchema = z.object({
  favorited: z.boolean(),
});
export type ToggleFavoriteResponse = z.infer<
  typeof toggleFavoriteResponseSchema
>;
