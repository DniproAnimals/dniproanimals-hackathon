import { z } from "zod";
import { successSchema } from "../../../shared/schemas";

export const deleteAnimalParamsSchema = z.object({
  id: z.coerce.number(),
});
export type DeleteAnimalParams = z.infer<typeof deleteAnimalParamsSchema>;

export const deleteAnimalResponseSchema = successSchema;
export type DeleteAnimalResponse = z.infer<typeof deleteAnimalResponseSchema>;
