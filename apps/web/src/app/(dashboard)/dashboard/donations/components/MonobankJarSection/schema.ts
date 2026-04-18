import { z } from "zod";

export const donateFormSchema = z.object({
  url: z.string(),
});

export type DonateFormValues = z.infer<typeof donateFormSchema>;

export const DONATE_FORM_DEFAULTS: DonateFormValues = { url: "" };
