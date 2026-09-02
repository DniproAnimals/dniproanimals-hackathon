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

export const animalDonationSupporterSchema = z.object({
  userId: z.number(),
  name: z.string(),
  email: z.string().email(),
  startedAt: z.string(),
});
export type AnimalDonationSupporter = z.infer<
  typeof animalDonationSupporterSchema
>;

export const animalDonationSupportersSummarySchema = z.object({
  count: z.number(),
  supporters: z.array(animalDonationSupporterSchema),
});
export type AnimalDonationSupportersSummary = z.infer<
  typeof animalDonationSupportersSummarySchema
>;

export const sendAnimalSupportUpdateBodySchema = z.object({
  photos: z.array(z.string().url()).min(1).max(10),
});
export type SendAnimalSupportUpdateBody = z.infer<
  typeof sendAnimalSupportUpdateBodySchema
>;

export const sendAnimalSupportUpdateResponseSchema = z.object({
  updateId: z.number(),
  recipientCount: z.number(),
  sentCount: z.number(),
  failedCount: z.number(),
});
export type SendAnimalSupportUpdateResponse = z.infer<
  typeof sendAnimalSupportUpdateResponseSchema
>;
