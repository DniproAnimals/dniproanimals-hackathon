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

export function AnimalWeightField() {
  const { control } = useFormContext<AnimalFormValues>();
  return (
    <FormField
      control={control}
      name="weightKg"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Вага (кг)</FormLabel>
          <FormControl>
            <Input
              type="number"
              step="0.1"
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
