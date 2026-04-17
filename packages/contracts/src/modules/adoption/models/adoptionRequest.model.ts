import { z } from "zod";

export const adoptionStatusSchema = z.enum(["pending", "approved", "rejected"]);
export type AdoptionStatus = z.infer<typeof adoptionStatusSchema>;

export const adoptionRequestModel = z.object({
  id: z.number(),
  animalId: z.number(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  instagram: z.string().nullable(),
  telegram: z.string().nullable(),
  facebook: z.string().nullable(),
  location: z.string().nullable(),
  message: z.string().nullable(),
  status: adoptionStatusSchema,
  createdAt: z.string(),
});
export type AdoptionRequest = z.infer<typeof adoptionRequestModel>;

export const adoptionRequestWithAnimalModel = adoptionRequestModel.extend({
  animalName: z.string().nullable(),
  animalType: z.string().nullable(),
});
export type AdoptionRequestWithAnimal = z.infer<
  typeof adoptionRequestWithAnimalModel
>;
