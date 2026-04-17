import { z } from "zod";

export const volunteerModel = z.object({
  id: z.number(),
  orgId: z.number(),
  userId: z.number().nullable(),
  name: z.string(),
  surname: z.string().nullable(),
  photo: z.string().nullable(),
  description: z.string().nullable(),
  phone: z.string().nullable(),
  email: z.string().nullable(),
  instagram: z.string().nullable(),
  telegram: z.string().nullable(),
  inviteToken: z.string().nullable(),
  createdAt: z.string(),
});
export type Volunteer = z.infer<typeof volunteerModel>;
