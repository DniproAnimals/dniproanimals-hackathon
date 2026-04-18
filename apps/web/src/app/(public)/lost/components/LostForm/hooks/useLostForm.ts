import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFormContext } from "react-hook-form";
import {
  LOST_FORM_DEFAULTS,
  LostFormValues,
  lostFormSchema,
} from "../constants/schema";

export const useLostForm = (defaultValues = LOST_FORM_DEFAULTS) =>
  useForm<LostFormValues>({
    resolver: zodResolver(lostFormSchema),
    defaultValues,
  });

export const useLostFormContext = () => useFormContext<LostFormValues>();
