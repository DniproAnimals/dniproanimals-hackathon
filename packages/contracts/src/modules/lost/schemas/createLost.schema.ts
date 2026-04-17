import { z } from "zod";
import { lostTypeSchema } from "../models";

export const createLostBodySchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  type: lostTypeSchema,
  animalType: z.string().nullish(),
  breed: z.string().nullish(),
  sex: z.string().nullish(),
  color: z.string().nullish(),
  size: z.string().nullish(),
  location: z.string().nullish(),
  lastSeenLocation: z.string().nullish(),
  lastSeenDate: z.string().nullish(),
  contactName: z.string().min(1),
  contactPhone: z.string().min(1),
  photos: z.array(z.string()).default([]),
});
export type CreateLostBody = z.infer<typeof createLostBodySchema>;

export const createLostResponseSchema = z.object({
  id: z.number(),
  success: z.boolean(),
});
export type CreateLostResponse = z.infer<typeof createLostResponseSchema>;
