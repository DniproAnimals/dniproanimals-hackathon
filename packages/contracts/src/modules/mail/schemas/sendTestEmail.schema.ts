import { z } from "zod";
import { successSchema } from "../../../shared";

export const sendTestEmailBodySchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1).optional(),
  text: z.string().min(1).optional(),
  html: z.string().min(1).optional(),
});
export type SendTestEmailBody = z.infer<typeof sendTestEmailBodySchema>;

export const sendTestEmailResponseSchema = successSchema;
export type SendTestEmailResponse = z.infer<typeof sendTestEmailResponseSchema>;
