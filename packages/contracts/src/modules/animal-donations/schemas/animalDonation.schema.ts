import { z } from "zod";

export const animalDonationParamsSchema = z.object({
  animalId: z.coerce.number().int().positive(),
});
export type AnimalDonationParams = z.infer<typeof animalDonationParamsSchema>;

export const animalDonationSupporterParamsSchema =
  animalDonationParamsSchema.extend({
    userId: z.coerce.number().int().positive(),
  });
export type AnimalDonationSupporterParams = z.infer<
  typeof animalDonationSupporterParamsSchema
>;

export const ANIMAL_SUPPORT_TYPES = [
  "financial",
  "food-and-medicine",
  "transport",
  "foster-care",
  "other",
] as const;

export const animalSupportTypeSchema = z.enum(ANIMAL_SUPPORT_TYPES);
export type AnimalSupportType = z.infer<typeof animalSupportTypeSchema>;

export const ANIMAL_SUPPORT_TYPE_LABELS: Record<AnimalSupportType, string> = {
  financial: "Фінансова допомога",
  "food-and-medicine": "Корм та ліки",
  transport: "Транспорт",
  "foster-care": "Тимчасова перетримка",
  other: "Інше",
};

export const startAnimalDonationBodySchema = z.object({
  supportType: animalSupportTypeSchema,
  phone: z
    .string()
    .trim()
    .min(7, "Вкажіть коректний номер телефону")
    .max(50, "Номер телефону занадто довгий")
    .regex(/^\+?[0-9()\s-]+$/, "Вкажіть коректний номер телефону"),
});
export type StartAnimalDonationBody = z.infer<
  typeof startAnimalDonationBodySchema
>;

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
  phone: z.string().nullable(),
  supportType: animalSupportTypeSchema.nullable(),
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
