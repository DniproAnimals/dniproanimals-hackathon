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
import { useAdoptionFormContext } from "../../hooks/useAdoptionForm";

export function AdoptionPhoneField() {
  const { control } = useAdoptionFormContext();
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
