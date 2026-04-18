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

export function AnimalAgeField() {
  const { control } = useFormContext<AnimalFormValues>();
  return (
    <FormField
      control={control}
      name="ageMonths"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Вік (місяців)</FormLabel>
          <FormControl>
            <Input
              type="number"
              value={field.value ?? ""}
              onChange={(e) =>
                field.onChange(e.target.value ? Number(e.target.value) : null)
              }
              onBlur={field.onBlur}
              name={field.name}
              ref={field.ref}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
