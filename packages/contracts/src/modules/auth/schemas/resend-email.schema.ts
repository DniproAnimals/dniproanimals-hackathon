import { z } from "zod";

export const resendEmailSchema = z.object({
  email: z.string().email(),
});
export type ResendEmailBody = z.infer<typeof resendEmailSchema>;

export const resendEmailResponseSchema = z.object({ success: z.boolean() });
export type ResendEmailResponse = z.infer<typeof resendEmailResponseSchema>;
