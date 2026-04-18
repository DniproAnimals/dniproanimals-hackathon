import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFormContext } from "react-hook-form";
import {
  DONATE_FORM_DEFAULTS,
  type DonateFormValues,
  donateFormSchema,
} from "../constants/schema";

export const useDonateForm = (defaultValues = DONATE_FORM_DEFAULTS) =>
  useForm<DonateFormValues>({
    resolver: zodResolver(donateFormSchema),
    defaultValues,
  });

export const useDonateFormContext = () => useFormContext<DonateFormValues>();
