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

export function VolunteerNameField() {
  const { control } = useFormContext<VolunteerFormValues>();
  return (
    <FormField
      control={control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Ім&apos;я *</FormLabel>
          <FormControl>
            <Input type="text" placeholder="Ім'я" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
