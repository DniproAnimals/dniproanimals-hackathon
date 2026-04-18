import { z } from "zod";

export const donateFormSchema = z.object({
  orgId: z
    .number({ required_error: "Оберіть організацію" })
    .int()
    .positive("Оберіть організацію"),
  amount: z
    .number({ invalid_type_error: "Мінімальна сума — 10 ₴" })
    .min(10, "Мінімальна сума — 10 ₴"),
});

export type DonateFormValues = z.infer<typeof donateFormSchema>;

export const DONATE_FORM_DEFAULTS: DonateFormValues = {
  orgId: 0,
  amount: 500,
};
