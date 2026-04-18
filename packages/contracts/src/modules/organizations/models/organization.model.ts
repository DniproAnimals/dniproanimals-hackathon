import { z } from "zod";

export const orgStatuses = ["pending", "approved", "rejected"] as const;
export type OrgStatus = (typeof orgStatuses)[number];
export const orgStatusSchema = z.enum(orgStatuses);

export const organizationModel = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  photo: z.string().nullable(),
  location: z.string().nullable(),
  phone: z.string().nullable(),
  email: z.string().nullable(),
  instagram: z.string().nullable(),
  telegram: z.string().nullable(),
  facebook: z.string().nullable(),
  website: z.string().nullable(),
  ownerId: z.number(),
  status: orgStatusSchema,
  monobankJarId: z.string().nullable(),
  createdAt: z.string(),
});
export type Organization = z.infer<typeof organizationModel>;
