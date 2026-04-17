import { z } from "zod";
import { organizationModel } from "../models";

export const getOrganizationParamsSchema = z.object({
  id: z.coerce.number(),
});
export type GetOrganizationParams = z.infer<typeof getOrganizationParamsSchema>;

export const getOrganizationResponseSchema = organizationModel;
export type GetOrganizationResponse = z.infer<
  typeof getOrganizationResponseSchema
>;
