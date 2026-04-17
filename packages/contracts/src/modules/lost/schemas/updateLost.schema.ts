import { z } from "zod";
import { lostAnimalModel } from "../models";
import { createLostBodySchema } from "./createLost.schema";

export const updateLostParamsSchema = z.object({
  id: z.coerce.number(),
});
export type UpdateLostParams = z.infer<typeof updateLostParamsSchema>;

export const updateLostBodySchema = createLostBodySchema.partial();
export type UpdateLostBody = z.infer<typeof updateLostBodySchema>;

export const updateLostResponseSchema = lostAnimalModel;
export type UpdateLostResponse = z.infer<typeof updateLostResponseSchema>;
