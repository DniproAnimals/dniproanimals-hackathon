import { z } from "zod";

export const EMAIL_TEMPLATE_KEYS = [
  "verification",
  "password-reset",
  "adoption-applicant",
  "adoption-admin",
  "animal-support-update",
] as const;

export const emailTemplateKeySchema = z.enum(EMAIL_TEMPLATE_KEYS);
export type EmailTemplateKey = z.infer<typeof emailTemplateKeySchema>;

const emailTemplateTextSchema = z.string().trim().min(1).max(5_000);

export const emailTemplateContentSchema = z.object({
  subject: z.string().trim().min(1).max(255),
  preview: z.string().trim().min(1).max(255),
  heading: z.string().trim().min(1).max(255),
  message: emailTemplateTextSchema,
  actionLabel: z.string().trim().min(1).max(255).nullable(),
  secondaryMessage: emailTemplateTextSchema.nullable(),
  footer: emailTemplateTextSchema,
});

export type UpdateEmailTemplateBody = z.infer<
  typeof emailTemplateContentSchema
>;

export const emailTemplateSchema = emailTemplateContentSchema.extend({
  key: emailTemplateKeySchema,
  updatedAt: z.string(),
});

export type EmailTemplate = z.infer<typeof emailTemplateSchema>;

export const listEmailTemplatesResponseSchema = z.array(emailTemplateSchema);

export const updateEmailTemplateResponseSchema = z.object({
  success: z.boolean(),
});

export type UpdateEmailTemplateResponse = z.infer<
  typeof updateEmailTemplateResponseSchema
>;
