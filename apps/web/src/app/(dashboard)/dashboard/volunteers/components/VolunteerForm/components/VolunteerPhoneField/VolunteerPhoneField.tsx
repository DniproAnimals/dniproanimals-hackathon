"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@dniproanimals/ui";
import { useFormContext } from "react-hook-form";
import type { VolunteerFormValues } from "../../schema";

export function VolunteerPhoneField() {
  const { control } = useFormContext<VolunteerFormValues>();
  return (
    <FormField
      control={control}
      name="phone"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Телефон</FormLabel>
          <FormControl>
            <Input type="tel" placeholder="Телефон" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
