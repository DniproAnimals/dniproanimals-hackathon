import { z } from "zod";
import { volunteerModel } from "../models";

export const volunteerStatuses = ["active", "pending"] as const;
export type VolunteerStatus = (typeof volunteerStatuses)[number];
export const volunteerStatusFilterSchema = z.enum(volunteerStatuses);
export type VolunteerStatusFilter = z.infer<typeof volunteerStatusFilterSchema>;

export const listVolunteersQuerySchema = z.object({
  q: z.string().optional(),
  status: volunteerStatusFilterSchema.optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
});
export type ListVolunteersQuery = z.infer<typeof listVolunteersQuerySchema>;

export const listVolunteersResponseSchema = z.array(volunteerModel);
export type ListVolunteersResponse = z.infer<
  typeof listVolunteersResponseSchema
>;

export const volunteersStatsResponseSchema = z.object({
  total: z.number(),
  active: z.number(),
  pending: z.number(),
});
export type VolunteersStatsResponse = z.infer<
  typeof volunteersStatsResponseSchema
>;
