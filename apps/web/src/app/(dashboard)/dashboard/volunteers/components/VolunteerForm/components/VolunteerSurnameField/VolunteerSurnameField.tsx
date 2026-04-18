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

export function VolunteerSurnameField() {
  const { control } = useFormContext<VolunteerFormValues>();
  return (
    <FormField
      control={control}
      name="surname"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Прізвище</FormLabel>
          <FormControl>
            <Input type="text" placeholder="Прізвище" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
