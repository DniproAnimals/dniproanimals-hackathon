import type {
  CreateLostBody,
  LostAnimal,
  LostType,
} from "@dniproanimals/contracts";
import { z } from "zod";

export const lostFormSchema = z.object({
  title: z.string().min(1, "Вкажіть хто загубився"),
  description: z.string().min(1, "Вкажіть опис"),
  type: z.enum(["lost", "found"]),
  animalType: z.string(),
  breed: z.string(),
  sex: z.string(),
  color: z.string(),
  size: z.string(),
  location: z.string(),
  lastSeenLocation: z.string(),
  lastSeenDate: z.string(),
  contactName: z.string().min(1, "Вкажіть ім'я"),
  contactPhone: z.string().min(1, "Вкажіть телефон"),
  photos: z.array(z.string()),
});

export type LostFormValues = z.infer<typeof lostFormSchema>;

export const LOST_FORM_DEFAULTS: LostFormValues = {
  title: "",
  description: "",
  type: "lost" as LostType,
  animalType: "",
  breed: "",
  sex: "",
  color: "",
  size: "",
  location: "",
  lastSeenLocation: "",
  lastSeenDate: "",
  contactName: "",
  contactPhone: "",
  photos: [],
};

export function lostToFormValues(item: LostAnimal): LostFormValues {
  return {
    title: item.title,
    description: item.description,
    type: item.type,
    animalType: item.animalType ?? "",
    breed: item.breed ?? "",
    sex: item.sex ?? "",
    color: item.color ?? "",
    size: item.size ?? "",
    location: item.location ?? "",
    lastSeenLocation: item.lastSeenLocation ?? "",
    lastSeenDate: item.lastSeenDate ?? "",
    contactName: item.contactName,
    contactPhone: item.contactPhone,
    photos: item.photos,
  };
}

export function lostFormValuesToBody(values: LostFormValues): CreateLostBody {
  return {
    title: values.title,
    description: values.description,
    type: values.type,
    animalType: values.animalType || null,
    breed: values.breed || null,
    sex: values.sex || null,
    color: values.color || null,
    size: values.size || null,
    location: values.location || null,
    lastSeenLocation: values.lastSeenLocation || null,
    lastSeenDate: values.lastSeenDate || null,
    contactName: values.contactName,
    contactPhone: values.contactPhone,
    photos: values.photos,
  };
}
