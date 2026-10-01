"use client";

import { CUSTOM_BREED } from "@/shared/constants";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@dniproanimals/ui";
import { useWatch } from "react-hook-form";
import { useAnimalFormContext } from "../../hooks/useAnimalForm";

export function AnimalCustomBreedField() {
  const { control } = useAnimalFormContext();

  const type = useWatch({
    control,
    name: "type",
  });

  const breed = useWatch({
    control,
    name: "breed",
  });

  // For "other" type, the regular breed field is rendered
  // by AnimalOtherBreedField instead.
  if (type === "other" || breed !== CUSTOM_BREED) {
    return null;
  }

  return (
    <FormField
      control={control}
      name="customBreed"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Назва породи *</FormLabel>

          <FormControl>
            <input
              {...field}
              type="text"
              placeholder="Наприклад: Алабай"
              className="w-full px-4 py-2.5 rounded-xl border text-sm border-gray-border bg-gray-light outline-none"
            />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
