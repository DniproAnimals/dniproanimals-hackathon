import { z } from "zod";
import { userModel } from "../../users";

export const registerBodySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});
export type RegisterBody = z.infer<typeof registerBodySchema>;

export const registerResponseSchema = userModel;
export type RegisterResponse = z.infer<typeof registerResponseSchema>;
