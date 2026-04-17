import { z } from "zod";
import { successSchema } from "../../../shared/schemas";

export const deleteVolunteerBodySchema = z.object({
  id: z.number(),
});
export type DeleteVolunteerBody = z.infer<typeof deleteVolunteerBodySchema>;

export const deleteVolunteerResponseSchema = successSchema;
export type DeleteVolunteerResponse = z.infer<
  typeof deleteVolunteerResponseSchema
>;
