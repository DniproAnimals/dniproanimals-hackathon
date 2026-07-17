import { z } from "zod";

export const tiptapDocumentSchema = z.any();

export const contractTemplateResponseSchema = z.object({
  id: z.number(),
  type: z.string(),
  title: z.string(),
  subtitle: z.string().nullable(),
  content: tiptapDocumentSchema,
  version: z.number(),
  updatedAt: z.string(),
});

export type ContractTemplateResponse = z.infer<
  typeof contractTemplateResponseSchema
>;

export const updateContractTemplateBodySchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().nullable().optional(),
  content: tiptapDocumentSchema,
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
