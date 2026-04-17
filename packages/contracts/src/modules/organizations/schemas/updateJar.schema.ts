import { z } from "zod";
import { successSchema } from "../../../shared/schemas";

export const updateJarBodySchema = z.object({
  monobankJarId: z.string().nullish(),
});
export type UpdateJarBody = z.infer<typeof updateJarBodySchema>;

export const updateJarResponseSchema = successSchema;
export type UpdateJarResponse = z.infer<typeof updateJarResponseSchema>;
