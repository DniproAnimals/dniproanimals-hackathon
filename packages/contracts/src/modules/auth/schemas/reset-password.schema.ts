import { z } from "zod";

export const forgotPasswordBodySchema = z.object({ email: z.string().email() });
export type ForgotPasswordBody = z.infer<typeof forgotPasswordBodySchema>;

export const resetPasswordBodySchema = z.object({
  token: z.string().min(1),
  newPassword: z.string().min(8),
});
export type ResetPasswordBody = z.infer<typeof resetPasswordBodySchema>;

export const successResponseSchema = z.object({ success: z.boolean() });
export type ResetPasswordResponse = z.infer<typeof successResponseSchema>;
