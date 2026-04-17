import { z } from "zod";
import { volunteerModel } from "../../volunteers/models";

export const orgVolunteersParamsSchema = z.object({
  id: z.coerce.number(),
});
export type OrgVolunteersParams = z.infer<typeof orgVolunteersParamsSchema>;

export const orgVolunteersResponseSchema = z.array(volunteerModel);
export type OrgVolunteersResponse = z.infer<typeof orgVolunteersResponseSchema>;
