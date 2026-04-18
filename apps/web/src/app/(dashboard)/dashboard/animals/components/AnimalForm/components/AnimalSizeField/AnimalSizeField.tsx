"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@dniproanimals/ui";
import { useAnimalFormContext } from "../../hooks/useAnimalForm";
import { AnimalChipGroup } from "../AnimalChipGroup";

const OPTIONS = [
  { value: "small", label: "Малий" },
  { value: "medium", label: "Середній" },
  { value: "large", label: "Великий" },
];

export function AnimalSizeField() {
  const { control } = useAnimalFormContext();
  return (
    <FormField
      control={control}
      name="size"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Розмір</FormLabel>
          <FormControl>
            <AnimalChipGroup
              options={OPTIONS}
              value={field.value}
              onChange={field.onChange}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
