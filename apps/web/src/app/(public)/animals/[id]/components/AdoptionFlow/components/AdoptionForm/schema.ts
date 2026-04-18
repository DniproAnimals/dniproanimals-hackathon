import type { CreateAdoptionBody } from "@dniproanimals/contracts";
import { z } from "zod";

export const adoptionFormSchema = z.object({
  name: z.string().min(1, "Вкажіть ім'я"),
  email: z.string().email("Некоректний email"),
  phone: z.string().min(1, "Вкажіть телефон"),
  location: z.string(),
  message: z.string().min(1, "Напишіть повідомлення"),
  instagram: z.string(),
  telegram: z.string(),
  facebook: z.string(),
});

export type AdoptionFormValues = z.infer<typeof adoptionFormSchema>;

export const ADOPTION_FORM_DEFAULTS: AdoptionFormValues = {
  name: "",
  email: "",
  phone: "",
  location: "",
  message: "",
  instagram: "",
  telegram: "",
  facebook: "",
};

export function adoptionFormValuesToBody(
  values: AdoptionFormValues,
  animalId: number,
): CreateAdoptionBody {
  return {
    animalId,
    name: values.name,
    email: values.email,
    phone: values.phone,
    location: values.location || null,
    message: values.message || null,
    instagram: values.instagram || null,
    telegram: values.telegram || null,
    facebook: values.facebook || null,
  };
}
