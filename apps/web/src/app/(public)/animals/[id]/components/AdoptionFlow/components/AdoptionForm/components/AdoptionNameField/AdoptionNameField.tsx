"use client";
import { IconUser } from "@dniproanimals/icons";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
  InputWithIcon,
} from "@dniproanimals/ui";
import { useFormContext } from "react-hook-form";
import type { AdoptionFormValues } from "../../schema";

export function AdoptionNameField() {
  const { control } = useFormContext<AdoptionFormValues>();
  return (
    <FormField
      control={control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <InputWithIcon icon={<IconUser size={16} />}>
              <Input type="text" placeholder="Ваше ім'я *" {...field} />
            </InputWithIcon>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
