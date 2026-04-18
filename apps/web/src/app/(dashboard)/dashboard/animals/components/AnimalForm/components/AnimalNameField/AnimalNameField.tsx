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
import type { AnimalFormValues } from "../../schema";

export function AnimalNameField() {
  const { control } = useFormContext<AnimalFormValues>();
  return (
    <FormField
      control={control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Ім&apos;я *</FormLabel>
          <FormControl>
            <Input type="text" placeholder="Ім'я тварини" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
