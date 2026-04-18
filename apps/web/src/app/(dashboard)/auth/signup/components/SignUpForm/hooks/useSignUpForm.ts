import {
  registerBodySchema,
  type RegisterBody,
} from "@dniproanimals/contracts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFormContext } from "react-hook-form";

export const useSignUpForm = (defaultValues?: RegisterBody) =>
  useForm<RegisterBody>({
    resolver: zodResolver(registerBodySchema),
    defaultValues,
  });

export const useSignUpFormContext = () => useFormContext<RegisterBody>();
