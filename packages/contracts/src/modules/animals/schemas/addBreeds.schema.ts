import { z } from "zod";

export const addBreedsBodySchema = z.object({
  speciesId: z.number(),
  breeds: z.array(z.string().min(1)),
});
export type AddBreedsBody = z.infer<typeof addBreedsBodySchema>;

export const addBreedsResponseSchema = z.object({
  success: z.boolean(),
  addedCount: z.number(),
});
export type AddBreedsResponse = z.infer<typeof addBreedsResponseSchema>;
