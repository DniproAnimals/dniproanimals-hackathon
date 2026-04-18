import { loginBodySchema, type LoginBody } from "@dniproanimals/contracts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFormContext } from "react-hook-form";

export const useSignInForm = (defaultValues?: LoginBody) =>
  useForm<LoginBody>({
    resolver: zodResolver(loginBodySchema),
    defaultValues,
  });

export const useSignInFormContext = () => useFormContext<LoginBody>();
