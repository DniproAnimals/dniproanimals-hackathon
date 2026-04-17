import { z } from "zod";

export const lostTypeSchema = z.enum(["lost", "found"]);
export type LostType = z.infer<typeof lostTypeSchema>;

export const lostAnimalModel = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  type: lostTypeSchema,
  animalType: z.string().nullable(),
  breed: z.string().nullable(),
  sex: z.string().nullable(),
  color: z.string().nullable(),
  size: z.string().nullable(),
  location: z.string().nullable(),
  lastSeenLocation: z.string().nullable(),
  lastSeenDate: z.string().nullable(),
  contactName: z.string(),
  contactPhone: z.string(),
  photos: z.array(z.string()),
  resolved: z.boolean(),
  createdAt: z.string(),
});
export type LostAnimal = z.infer<typeof lostAnimalModel>;
