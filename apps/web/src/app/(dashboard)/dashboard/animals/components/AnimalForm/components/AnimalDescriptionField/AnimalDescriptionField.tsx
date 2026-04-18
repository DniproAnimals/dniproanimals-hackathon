"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Textarea,
} from "@dniproanimals/ui";
import { useFormContext } from "react-hook-form";
import type { AnimalFormValues } from "../../schema";

export function AnimalDescriptionField() {
  const { control } = useFormContext<AnimalFormValues>();
  return (
    <FormField
      control={control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Опис</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Характер, звички, особливості..."
              rows={3}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
