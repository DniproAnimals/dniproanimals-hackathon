import { z } from "zod";

export const forgotPasswordFormSchema = z.object({
  email: z.string().email("Введіть коректну email адресу"),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordFormSchema>;

export const FORGOT_PASSWORD_DEFAULTS: ForgotPasswordFormValues = {
  email: "",
};
