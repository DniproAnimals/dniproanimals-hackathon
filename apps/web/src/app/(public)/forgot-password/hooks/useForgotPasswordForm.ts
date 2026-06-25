import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFormContext } from "react-hook-form";
import { ForgotPasswordFormValues } from "../components/ForgotPasswordForm";
import {
  FORGOT_PASSWORD_DEFAULTS,
  forgotPasswordFormSchema,
} from "../components/ForgotPasswordForm/schema";

export const useForgotPasswordForm = (
  defaultValues = FORGOT_PASSWORD_DEFAULTS,
) =>
  useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues,
    mode: "onSubmit",
  });

export const useForgotPasswordFormContext = () =>
  useFormContext<ForgotPasswordFormValues>();
