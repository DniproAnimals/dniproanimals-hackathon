import { z } from "zod";
import { userModel } from "../../users";

export const loginBodySchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Вкажіть email")
    .email("Вкажіть коректний email"),
  password: z.string().min(1, "Вкажіть пароль"),
});
export type LoginBody = z.infer<typeof loginBodySchema>;

export const loginResponseSchema = userModel;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
