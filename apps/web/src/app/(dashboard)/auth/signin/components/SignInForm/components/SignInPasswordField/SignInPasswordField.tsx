"use client";
import { IconLockFilled } from "@dniproanimals/icons";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
  InputWithIcon,
} from "@dniproanimals/ui";
import { useSignInFormContext } from "../../hooks/useSignInForm";

export function SignInPasswordField() {
  const { control } = useSignInFormContext();
  return (
    <FormField
      control={control}
      name="password"
      render={({ field }) => (
        <FormItem>
          <InputWithIcon icon={<IconLockFilled />}>
            <FormControl>
              <Input type="password" placeholder="Пароль" {...field} />
            </FormControl>
          </InputWithIcon>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
