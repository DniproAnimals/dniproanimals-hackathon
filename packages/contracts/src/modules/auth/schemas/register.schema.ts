import { z } from "zod";
import { userModel } from "../../users";

export const registerBodySchema = z.object({
  name: z.string().trim().min(1, "Вкажіть ім'я"),
  email: z
    .string()
    .trim()
    .min(1, "Вкажіть email")
    .email("Вкажіть коректний email"),
  password: z.string().min(6, "Пароль має містити щонайменше 6 символів"),
});
export type RegisterBody = z.infer<typeof registerBodySchema>;

export const registerResponseSchema = userModel;
export type RegisterResponse = z.infer<typeof registerResponseSchema>;
