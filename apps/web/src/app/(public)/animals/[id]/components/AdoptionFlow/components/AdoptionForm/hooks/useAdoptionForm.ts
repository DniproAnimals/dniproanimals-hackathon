import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFormContext } from "react-hook-form";
import {
  ADOPTION_FORM_DEFAULTS,
  AdoptionFormValues,
  adoptionFormSchema,
} from "../schema";

export const useAdoptionForm = (defaultValues = ADOPTION_FORM_DEFAULTS) =>
  useForm<AdoptionFormValues>({
    resolver: zodResolver(adoptionFormSchema),
    defaultValues,
  });

export const useAdoptionFormContext = () =>
  useFormContext<AdoptionFormValues>();
