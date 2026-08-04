import { z } from "zod";

export const animalTypeSchema = z.string();
export type AnimalType = string;

export const animalSexSchema = z.enum(["male", "female"]);
export type AnimalSex = z.infer<typeof animalSexSchema>;

export const animalSizeSchema = z.enum(["small", "medium", "large"]);
export type AnimalSize = z.infer<typeof animalSizeSchema>;

export const animalStatusSchema = z.enum(["available", "reserved", "adopted"]);
export type AnimalStatus = z.infer<typeof animalStatusSchema>;

export const animalModel = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  type: animalTypeSchema,
  breed: z.string().nullable(),
  sex: animalSexSchema.nullable(),
  ageMonths: z.number().nullable(),
  weightKg: z.number().nullable(),
  size: animalSizeSchema.nullable(),
  color: z.string().nullable(),
  vaccinated: z.boolean().nullable(),
  sterilized: z.boolean().nullable(),
  trained: z.boolean().nullable(),
  commands: z.string().nullable(),
  photos: z.array(z.string()),
  contactName: z.string().nullable(),
  contactPhone: z.string().nullable(),
  contactEmail: z.string().nullable(),
  contactInstagram: z.string().nullable(),
  contactTelegram: z.string().nullable(),
  contactFacebook: z.string().nullable(),
  contactLocation: z.string().nullable(),
  status: animalStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Animal = z.infer<typeof animalModel>;
