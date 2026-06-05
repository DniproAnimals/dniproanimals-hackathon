import { z } from "zod";
import { successSchema } from "../../../shared";

export const verifyEmailQuerySchema = z.object({
  token: z.string().min(1),
});
export type VerifyEmailQuery = z.infer<typeof verifyEmailQuerySchema>;

export const verifyEmailResponseSchema = successSchema;
export type VerifyEmailResponse = z.infer<typeof verifyEmailResponseSchema>;
