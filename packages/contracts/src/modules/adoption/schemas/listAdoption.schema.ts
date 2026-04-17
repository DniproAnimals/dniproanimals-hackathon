import { z } from "zod";
import { adoptionRequestWithAnimalModel } from "../models";

export const listAdoptionQuerySchema = z.object({
  orgId: z.coerce.number().optional(),
});
export type ListAdoptionQuery = z.infer<typeof listAdoptionQuerySchema>;

export const listAdoptionResponseSchema = z.array(
  adoptionRequestWithAnimalModel,
);
export type ListAdoptionResponse = z.infer<typeof listAdoptionResponseSchema>;
