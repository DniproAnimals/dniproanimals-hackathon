import { z } from "zod";

export const resetPasswordFormSchema = z
  .object({
    newPassword: z.string().min(8, "Мінімум 8 символів"),
    confirmPassword: z.string().min(8, "Мінімум 8 символів"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Паролі не збігаються",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordFormSchema>;

export const RESET_PASSWORD_DEFAULTS: ResetPasswordFormValues = {
  newPassword: "",
  confirmPassword: "",
};
