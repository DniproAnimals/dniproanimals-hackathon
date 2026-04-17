import { z } from "zod";
import { userModel } from "../../users";

export const meResponseSchema = userModel;
export type MeResponse = z.infer<typeof meResponseSchema>;
