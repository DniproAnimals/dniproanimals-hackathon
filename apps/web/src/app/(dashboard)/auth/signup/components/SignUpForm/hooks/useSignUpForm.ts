import {
  registerBodySchema,
  type RegisterBody,
} from "@dniproanimals/contracts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFormContext } from "react-hook-form";

export const SIGN_UP_FORM_DEFAULTS: RegisterBody = {
  name: "",
  email: "",
  password: "",
};

export const useSignUpForm = (
  defaultValues: RegisterBody = SIGN_UP_FORM_DEFAULTS,
) =>
  useForm<RegisterBody>({
    resolver: zodResolver(registerBodySchema),
    defaultValues,
  });

export const useSignUpFormContext = () => useFormContext<RegisterBody>();
