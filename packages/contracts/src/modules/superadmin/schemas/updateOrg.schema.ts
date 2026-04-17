import { z } from "zod";
import { successSchema } from "../../../shared/schemas";
import { orgStatusSchema } from "../../organizations/models";

export const superadminUpdateOrgBodySchema = z.object({
  id: z.number(),
  status: orgStatusSchema,
});
export type SuperadminUpdateOrgBody = z.infer<
  typeof superadminUpdateOrgBodySchema
>;

export const superadminUpdateOrgResponseSchema = successSchema;
export type SuperadminUpdateOrgResponse = z.infer<
  typeof superadminUpdateOrgResponseSchema
>;
