import { z } from "zod";
import { userModel } from "../../users";

export const loginBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
export type LoginBody = z.infer<typeof loginBodySchema>;

export const loginResponseSchema = userModel;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
