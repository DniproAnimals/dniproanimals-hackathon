import { z } from "zod";

export const contractSectionSchema = z.object({
  title: z.string().min(1),
  paragraphs: z.array(z.string().min(1)).min(1),
});

export type ContractSection = z.infer<typeof contractSectionSchema>;

export const contractContentSchema = z.object({
  parties: z.object({ shelter: z.string(), adopter: z.string() }),
  sections: z.array(contractSectionSchema).min(1),
  signatures: z.array(z.object({ role: z.string(), line: z.string() })),
  datePlaceholder: z.string(),
});

export type ContractContent = z.infer<typeof contractContentSchema>;

export const contractTemplateResponseSchema = z.object({
  id: z.number(),
  type: z.string(),
  title: z.string(),
  subtitle: z.string().nullable(),
  content: contractContentSchema,
  version: z.number(),
  updatedAt: z.string(),
});

export type ContractTemplateResponse = z.infer<
  typeof contractTemplateResponseSchema
>;

export const updateContractTemplateBodySchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().nullable().optional(),
  content: contractContentSchema,
});

export type UpdateContractTemplateBody = z.infer<
  typeof updateContractTemplateBodySchema
>;

export const updateContractTemplateResponseSchema = z.object({
  success: z.boolean(),
});

export type UpdateContractTemplateResponse = z.infer<
  typeof updateContractTemplateResponseSchema
>;
