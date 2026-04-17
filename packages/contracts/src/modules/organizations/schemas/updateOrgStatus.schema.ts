import { z } from "zod";
import { successSchema } from "../../../shared/schemas";

export const updateOrgStatusBodySchema = z.object({
  id: z.number(),
  status: z.enum(["approved", "rejected"]),
});
export type UpdateOrgStatusBody = z.infer<typeof updateOrgStatusBodySchema>;

export const updateOrgStatusResponseSchema = successSchema;
export type UpdateOrgStatusResponse = z.infer<
  typeof updateOrgStatusResponseSchema
>;
