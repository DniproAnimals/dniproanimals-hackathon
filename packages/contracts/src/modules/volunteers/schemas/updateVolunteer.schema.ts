import { z } from "zod";
import { successSchema } from "../../../shared/schemas";

export const updateVolunteerBodySchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  surname: z.string().nullish(),
  photo: z.string().nullish(),
  description: z.string().nullish(),
  phone: z.string().nullish(),
  email: z.string().nullish(),
  instagram: z.string().nullish(),
  telegram: z.string().nullish(),
});
export type UpdateVolunteerBody = z.infer<typeof updateVolunteerBodySchema>;

export const updateVolunteerResponseSchema = successSchema;
export type UpdateVolunteerResponse = z.infer<
  typeof updateVolunteerResponseSchema
>;
