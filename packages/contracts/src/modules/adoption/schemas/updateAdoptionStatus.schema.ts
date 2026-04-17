import { z } from "zod";
import { successSchema } from "../../../shared/schemas";

export const updateAdoptionStatusBodySchema = z.object({
  id: z.number(),
  status: z.enum(["approved", "rejected"]),
});
export type UpdateAdoptionStatusBody = z.infer<
  typeof updateAdoptionStatusBodySchema
>;

export const updateAdoptionStatusResponseSchema = successSchema;
export type UpdateAdoptionStatusResponse = z.infer<
  typeof updateAdoptionStatusResponseSchema
>;
