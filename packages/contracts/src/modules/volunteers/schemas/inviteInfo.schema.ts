import { z } from "zod";

export const inviteInfoQuerySchema = z.object({
  token: z.string().min(1),
});
export type InviteInfoQuery = z.infer<typeof inviteInfoQuerySchema>;

export const inviteInfoResponseSchema = z.object({
  volunteerName: z.string(),
  volunteerSurname: z.string().nullable(),
  orgName: z.string().nullable(),
});
export type InviteInfoResponse = z.infer<typeof inviteInfoResponseSchema>;
