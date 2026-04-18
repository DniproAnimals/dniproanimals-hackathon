import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFormContext } from "react-hook-form";
import {
  ACCEPT_INVITE_FORM_DEFAULTS,
  type AcceptInviteFormValues,
  acceptInviteFormSchema,
} from "../schema";

export const useAcceptInviteForm = (
  defaultValues = ACCEPT_INVITE_FORM_DEFAULTS,
) =>
  useForm<AcceptInviteFormValues>({
    resolver: zodResolver(acceptInviteFormSchema),
    defaultValues,
  });

export const useAcceptInviteFormContext = () =>
  useFormContext<AcceptInviteFormValues>();
