import { z } from "zod";

export const createAdoptionBodySchema = z.object({
  animalId: z.number(),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  instagram: z.string().nullish(),
  telegram: z.string().nullish(),
  facebook: z.string().nullish(),
  location: z.string().nullish(),
  message: z.string().nullish(),
});
export type CreateAdoptionBody = z.infer<typeof createAdoptionBodySchema>;

export const createAdoptionResponseSchema = z.object({
  id: z.number(),
  success: z.boolean(),
});
export type CreateAdoptionResponse = z.infer<
  typeof createAdoptionResponseSchema
>;
