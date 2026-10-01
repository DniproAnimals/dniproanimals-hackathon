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

export function AnimalOtherBreedField() {
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
      name="breed"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Порода</FormLabel>

          <FormControl>
            <input
              {...field}
              type="text"
              placeholder="Введіть породу"
              className="w-full px-4 py-2.5 rounded-xl border text-sm border-gray-border bg-gray-light outline-none"
            />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
