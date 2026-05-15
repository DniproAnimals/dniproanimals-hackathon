import { z } from "zod";
import {
  adoptionRequestWithAnimalModel,
  adoptionStatusSchema,
} from "../models";

export const listAdoptionQuerySchema = z.object({
  q: z.string().optional(),
  status: adoptionStatusSchema.optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
});
export type ListAdoptionQuery = z.infer<typeof listAdoptionQuerySchema>;

export const listAdoptionResponseSchema = z.array(
  adoptionRequestWithAnimalModel,
);
export type ListAdoptionResponse = z.infer<typeof listAdoptionResponseSchema>;

export const adoptionStatsResponseSchema = z.object({
  total: z.number(),
  pending: z.number(),
  approved: z.number(),
  rejected: z.number(),
});
export type AdoptionStatsResponse = z.infer<typeof adoptionStatsResponseSchema>;
