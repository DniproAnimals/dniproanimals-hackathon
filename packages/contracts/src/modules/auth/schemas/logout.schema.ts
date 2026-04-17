import { z } from "zod";
import { successSchema } from "../../../shared/schemas";

export const logoutResponseSchema = successSchema;
export type LogoutResponse = z.infer<typeof logoutResponseSchema>;
