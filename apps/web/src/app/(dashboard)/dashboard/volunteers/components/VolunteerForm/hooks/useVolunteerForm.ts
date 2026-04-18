import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFormContext } from "react-hook-form";
import {
  VOLUNTEER_FORM_DEFAULTS,
  VolunteerFormValues,
  volunteerFormSchema,
} from "../schema";

export const useVolunteerForm = (defaultValues = VOLUNTEER_FORM_DEFAULTS) =>
  useForm<VolunteerFormValues>({
    resolver: zodResolver(volunteerFormSchema),
    defaultValues,
  });

export const useVolunteerFormContext = () =>
  useFormContext<VolunteerFormValues>();
