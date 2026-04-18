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
import { useAdoptionFormContext } from "../../hooks/useAdoptionForm";

export function AdoptionNameField() {
  const { control } = useAdoptionFormContext();
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
