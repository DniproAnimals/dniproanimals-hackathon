import type { CreateVolunteerBody, Volunteer } from "@dniproanimals/contracts";
import { z } from "zod";

export const volunteerFormSchema = z.object({
  name: z.string().min(1, "Вкажіть ім'я"),
  surname: z.string(),
  photo: z.string(),
  description: z.string(),
  phone: z.string(),
  email: z.string(),
  instagram: z.string(),
  telegram: z.string(),
});

export type VolunteerFormValues = z.infer<typeof volunteerFormSchema>;

export const VOLUNTEER_FORM_DEFAULTS: VolunteerFormValues = {
  name: "",
  surname: "",
  photo: "",
  description: "",
  phone: "",
  email: "",
  instagram: "",
  telegram: "",
};

export function volunteerToFormValues(v: Volunteer): VolunteerFormValues {
  return {
    name: v.name,
    surname: v.surname ?? "",
    photo: v.photo ?? "",
    description: v.description ?? "",
    phone: v.phone ?? "",
    email: v.email ?? "",
    instagram: v.instagram ?? "",
    telegram: v.telegram ?? "",
  };
}

export function volunteerFormValuesToBody(
  values: VolunteerFormValues,
): CreateVolunteerBody {
  return {
    name: values.name,
    surname: values.surname || null,
    photo: values.photo || null,
    description: values.description || null,
    phone: values.phone || null,
    email: values.email || null,
    instagram: values.instagram || null,
    telegram: values.telegram || null,
  };
}
