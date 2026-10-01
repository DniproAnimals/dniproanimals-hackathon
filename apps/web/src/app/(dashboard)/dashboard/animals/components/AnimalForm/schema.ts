import { OTHER_ANIMAL_COLOR_VALUE } from "@/shared/constants";
import {
  animalSexSchema,
  animalSizeSchema,
  animalTypeSchema,
  type CreateAnimalBody,
} from "@dniproanimals/contracts";
import { z } from "zod";

const animalColorSchema = z
  .string()
  .min(1, "Оберіть колір")
  .refine((value) => value !== OTHER_ANIMAL_COLOR_VALUE, {
    message: "Оберіть коректний колір",
  });

export const animalFormSchema = z.object({
  name: z.string().min(1, "Вкажіть ім'я"),
  description: z.string(),
  type: animalTypeSchema,
  breed: z.string(),
  sex: z.union([animalSexSchema, z.literal("")]),
  ageMonths: z.number().nullable(),
  weightKg: z.number().nullable(),
  size: z.union([animalSizeSchema, z.literal("")]),
  color: animalColorSchema,
  vaccinated: z.boolean(),
  sterilized: z.boolean(),
  trained: z.boolean(),
  donationsEnabled: z.boolean(),
  photos: z.array(z.string()),
  contactName: z.string(),
  contactPhone: z.string(),
  contactEmail: z.string(),
  contactLocation: z.string(),
});

export type AnimalFormValues = z.infer<typeof animalFormSchema>;

export const ANIMAL_FORM_DEFAULTS: AnimalFormValues = {
  name: "",
  description: "",
  type: "dog",
  breed: "",
  sex: "",
  ageMonths: null,
  weightKg: null,
  size: "",
  color: "",
  vaccinated: true,
  sterilized: true,
  trained: true,
  donationsEnabled: false,
  photos: [],
  contactName: "",
  contactPhone: "",
  contactEmail: "",
  contactLocation: "",
};

export function animalFormValuesToBody(
  values: AnimalFormValues,
): Omit<CreateAnimalBody, "status"> {
  return {
    name: values.name,
    description: values.description || null,
    type: values.type,
    breed: values.breed || null,
    sex: values.sex || null,
    ageMonths: values.ageMonths,
    weightKg: values.weightKg,
    size: values.size || null,
    color: values.color || null,
    vaccinated: values.vaccinated,
    sterilized: values.sterilized,
    trained: values.trained,
    donationsEnabled: values.donationsEnabled,
    photos: values.photos,
    contactName: values.contactName || null,
    contactPhone: values.contactPhone || null,
    contactEmail: values.contactEmail || null,
    contactLocation: values.contactLocation || null,
  };
}
