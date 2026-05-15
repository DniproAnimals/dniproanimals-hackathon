import { z } from "zod";
import { foundationSchema } from "./foundation.model";

export const updateFoundationBodySchema = foundationSchema.omit({
  id: true,
  updatedAt: true,
});

export type UpdateFoundationBody = z.infer<typeof updateFoundationBodySchema>;

export const updateFoundationResponseSchema = z.object({
  success: z.boolean(),
});

export type UpdateFoundationResponse = z.infer<
  typeof updateFoundationResponseSchema
>;
