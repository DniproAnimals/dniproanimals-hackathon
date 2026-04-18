import { z } from "zod";
import { orgStatusSchema, organizationModel } from "../../organizations/models";

export const superadminListOrgsQuerySchema = z.object({
  status: orgStatusSchema.nullish(),
});
export type SuperadminListOrgsQuery = z.infer<
  typeof superadminListOrgsQuerySchema
>;

export const superadminListOrgsResponseSchema = z.array(organizationModel);
export type SuperadminListOrgsResponse = z.infer<
  typeof superadminListOrgsResponseSchema
>;

export const superadminOrgsStatsResponseSchema = z.object({
  total: z.number(),
  pending: z.number(),
  approved: z.number(),
  rejected: z.number(),
});
export type SuperadminOrgsStatsResponse = z.infer<
  typeof superadminOrgsStatsResponseSchema
>;
