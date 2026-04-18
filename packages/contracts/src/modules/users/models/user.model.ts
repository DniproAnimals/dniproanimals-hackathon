import { z } from "zod";
import { userRoleSchema } from "../../../shared/enums";

export const userModel = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  role: userRoleSchema,
  photo: z.string().nullable(),
  description: z.string().nullable(),
  phone: z.string().nullable(),
  instagram: z.string().nullable(),
  telegram: z.string().nullable(),
  facebook: z.string().nullable(),
  orgId: z.number().nullable(),
  createdAt: z.string(),
});

export type User = z.infer<typeof userModel>;
