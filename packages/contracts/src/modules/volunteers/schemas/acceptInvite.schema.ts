import { z } from "zod";
import { userModel } from "../../users";

export const acceptInviteBodySchema = z.object({
  token: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});
export type AcceptInviteBody = z.infer<typeof acceptInviteBodySchema>;

export const acceptInviteResponseSchema = userModel;
export type AcceptInviteResponse = z.infer<typeof acceptInviteResponseSchema>;
