"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@dniproanimals/ui";
import { useWatch } from "react-hook-form";
import { useAnimalFormContext } from "../../hooks/useAnimalForm";

export function AnimalCustomTypeField() {
  const { control } = useAnimalFormContext();

  const type = useWatch({
    control,
    name: "type",
  });

  if (type !== "other") {
    return null;
  }

  return (
    <FormField
      control={control}
      name="customType"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Назва виду *</FormLabel>

          <FormControl>
            <input
              {...field}
              type="text"
              placeholder="Наприклад: Кролик"
              className="w-full px-4 py-2.5 rounded-xl border text-sm border-gray-border bg-gray-light outline-none"
            />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
