import { loginBodySchema, type LoginBody } from "@dniproanimals/contracts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFormContext } from "react-hook-form";

export const SIGN_IN_FORM_DEFAULTS: LoginBody = {
  email: "",
  password: "",
};

export const useSignInForm = (
  defaultValues: LoginBody = SIGN_IN_FORM_DEFAULTS,
) =>
  useForm<LoginBody>({
    resolver: zodResolver(loginBodySchema),
    defaultValues,
  });

export const useSignInFormContext = () => useFormContext<LoginBody>();
