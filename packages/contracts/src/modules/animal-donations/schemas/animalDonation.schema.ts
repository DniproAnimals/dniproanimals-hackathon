import { z } from "zod";

export const animalDonationParamsSchema = z.object({
  animalId: z.coerce.number().int().positive(),
});
export type AnimalDonationParams = z.infer<typeof animalDonationParamsSchema>;

export const animalDonationResponseSchema = z.object({
  active: z.boolean(),
});
export type AnimalDonationResponse = z.infer<
  typeof animalDonationResponseSchema
>;
