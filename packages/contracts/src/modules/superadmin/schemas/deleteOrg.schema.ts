import { z } from "zod";
import { successSchema } from "../../../shared/schemas";

export const superadminDeleteOrgBodySchema = z.object({
  id: z.number(),
});
export type SuperadminDeleteOrgBody = z.infer<
  typeof superadminDeleteOrgBodySchema
>;

export const superadminDeleteOrgResponseSchema = successSchema;
export type SuperadminDeleteOrgResponse = z.infer<
  typeof superadminDeleteOrgResponseSchema
>;
