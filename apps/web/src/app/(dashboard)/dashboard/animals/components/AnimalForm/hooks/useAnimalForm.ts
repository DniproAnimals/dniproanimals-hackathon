import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFormContext } from "react-hook-form";
import {
  ANIMAL_FORM_DEFAULTS,
  AnimalFormValues,
  animalFormSchema,
} from "../schema";

export const useAnimalForm = (defaultValues = ANIMAL_FORM_DEFAULTS) =>
  useForm<AnimalFormValues>({
    resolver: zodResolver(animalFormSchema),
    defaultValues,
  });

export const useAnimalFormContext = () => useFormContext<AnimalFormValues>();
