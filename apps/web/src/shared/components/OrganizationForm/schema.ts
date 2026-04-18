import type { Organization } from "@dniproanimals/contracts";
import { z } from "zod";

export const CONTACT_TYPES = [
  "instagram",
  "telegram",
  "facebook",
  "website",
] as const;
export type ContactType = (typeof CONTACT_TYPES)[number];

export const organizationFormSchema = z.object({
  name: z.string().min(1, "Вкажіть назву"),
  description: z.string(),
  photo: z.string(),
  location: z.string(),
  phone: z.string(),
  email: z.string(),
  instagram: z.string(),
  telegram: z.string(),
  facebook: z.string(),
  website: z.string(),
});

export type OrganizationFormValues = z.infer<typeof organizationFormSchema>;

export const ORGANIZATION_FORM_DEFAULTS: OrganizationFormValues = {
  name: "",
  description: "",
  photo: "",
  location: "",
  phone: "",
  email: "",
  instagram: "",
  telegram: "",
  facebook: "",
  website: "",
};

export function organizationToFormValues(
  org: Organization,
): OrganizationFormValues {
  return {
    name: org.name,
    description: org.description ?? "",
    photo: org.photo ?? "",
    location: org.location ?? "",
    phone: org.phone ?? "",
    email: org.email ?? "",
    instagram: org.instagram ?? "",
    telegram: org.telegram ?? "",
    facebook: org.facebook ?? "",
    website: org.website ?? "",
  };
}
