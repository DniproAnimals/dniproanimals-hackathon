import { z } from "zod";
import {
  animalModel,
  animalSexSchema,
  animalSizeSchema,
  animalStatusSchema,
  animalTypeSchema,
} from "../models";

export const createAnimalBodySchema = z.object({
  name: z.string().min(1),
  description: z.string().nullish(),
  type: animalTypeSchema,
  breed: z.string().nullish(),
  sex: animalSexSchema.nullish(),
  ageMonths: z.number().int().nullish(),
  weightKg: z.number().nullish(),
  size: animalSizeSchema.nullish(),
  color: z.string().nullish(),
  vaccinated: z.boolean().nullish(),
  sterilized: z.boolean().nullish(),
  trained: z.boolean().nullish(),
  commands: z.string().nullish(),
  photos: z.array(z.string()).default([]),
  status: animalStatusSchema.default("available"),
  contactName: z.string().nullish(),
  contactPhone: z.string().nullish(),
  contactEmail: z.string().nullish(),
  contactInstagram: z.string().nullish(),
  contactTelegram: z.string().nullish(),
  contactFacebook: z.string().nullish(),
  contactLocation: z.string().nullish(),
});
export type CreateAnimalBody = z.infer<typeof createAnimalBodySchema>;

export const createAnimalResponseSchema = animalModel;
export type CreateAnimalResponse = z.infer<typeof createAnimalResponseSchema>;
