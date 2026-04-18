"use client";
import { IconPhone } from "@dniproanimals/icons";
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

export function AdoptionPhoneField() {
  const { control } = useFormContext<AdoptionFormValues>();
  return (
    <FormField
      control={control}
      name="phone"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <InputWithIcon icon={<IconPhone size={16} />}>
              <Input type="tel" placeholder="Телефон *" {...field} />
            </InputWithIcon>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
