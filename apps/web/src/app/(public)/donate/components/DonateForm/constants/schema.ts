import { z } from "zod";

export const donateFormSchema = z.object({
  amount: z
    .number({ invalid_type_error: "Мінімальна сума — 10 ₴" })
    .min(10, "Мінімальна сума — 10 ₴"),
});

export type DonateFormValues = z.infer<typeof donateFormSchema>;

export const DONATE_FORM_DEFAULTS: DonateFormValues = {
  amount: 500,
};
