import { z } from "zod";

export const createVolunteerBodySchema = z.object({
  name: z.string().min(1),
  surname: z.string().nullish(),
  photo: z.string().nullish(),
  description: z.string().nullish(),
  phone: z.string().nullish(),
  email: z.string().nullish(),
  instagram: z.string().nullish(),
  telegram: z.string().nullish(),
});
export type CreateVolunteerBody = z.infer<typeof createVolunteerBodySchema>;

export const createVolunteerResponseSchema = z.object({
  id: z.number(),
  inviteToken: z.string(),
});
export type CreateVolunteerResponse = z.infer<
  typeof createVolunteerResponseSchema
>;
