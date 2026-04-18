"use client";
import { IconUserFilled } from "@dniproanimals/icons";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
  InputWithIcon,
} from "@dniproanimals/ui";
import { useSignUpFormContext } from "../../hooks/useSignUpForm";

export function SignUpNameField() {
  const { control } = useSignUpFormContext();
  return (
    <FormField
      control={control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <InputWithIcon icon={<IconUserFilled />}>
            <FormControl>
              <Input type="text" placeholder="Ім'я" {...field} />
            </FormControl>
          </InputWithIcon>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
