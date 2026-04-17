import { z } from "zod";

export const createOrganizationBodySchema = z.object({
  name: z.string().min(1),
  description: z.string().nullish(),
  photo: z.string().nullish(),
  location: z.string().nullish(),
  phone: z.string().nullish(),
  email: z.string().nullish(),
  instagram: z.string().nullish(),
  telegram: z.string().nullish(),
  facebook: z.string().nullish(),
  website: z.string().nullish(),
});
export type CreateOrganizationBody = z.infer<
  typeof createOrganizationBodySchema
>;

export const createOrganizationResponseSchema = z.object({
  id: z.number(),
});
export type CreateOrganizationResponse = z.infer<
  typeof createOrganizationResponseSchema
>;
