import { z } from "zod";
import { animalModel } from "../../animals";

export const orgAnimalsParamsSchema = z.object({
  id: z.coerce.number(),
});
export type OrgAnimalsParams = z.infer<typeof orgAnimalsParamsSchema>;

export const orgAnimalsResponseSchema = z.array(animalModel);
export type OrgAnimalsResponse = z.infer<typeof orgAnimalsResponseSchema>;
