import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFormContext } from "react-hook-form";
import { ResetPasswordFormValues } from "../components/ResetPasswordForm";
import {
  RESET_PASSWORD_DEFAULTS,
  resetPasswordFormSchema,
} from "../components/ResetPasswordForm/schema";

export const useResetPasswordForm = (defaultValues = RESET_PASSWORD_DEFAULTS) =>
  useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues,
    mode: "onSubmit",
  });

export const useResetPasswordFormContext = () =>
  useFormContext<ResetPasswordFormValues>();
