"use client";
import { IconMailFilled } from "@dniproanimals/icons";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
  InputWithIcon,
} from "@dniproanimals/ui";
import { useSignUpFormContext } from "../../hooks/useSignUpForm";

export function SignUpEmailField() {
  const { control } = useSignUpFormContext();
  return (
    <FormField
      control={control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <InputWithIcon icon={<IconMailFilled />}>
            <FormControl>
              <Input type="email" placeholder="Email" {...field} />
            </FormControl>
          </InputWithIcon>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
