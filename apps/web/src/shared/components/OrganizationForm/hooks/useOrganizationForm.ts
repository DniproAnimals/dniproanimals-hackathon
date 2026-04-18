import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFormContext } from "react-hook-form";
import {
  ORGANIZATION_FORM_DEFAULTS,
  OrganizationFormValues,
  organizationFormSchema,
} from "../schema";

export const useOrganizationForm = (
  defaultValues = ORGANIZATION_FORM_DEFAULTS,
) =>
  useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationFormSchema),
    defaultValues,
  });

export const useOrganizationFormContext = () =>
  useFormContext<OrganizationFormValues>();
