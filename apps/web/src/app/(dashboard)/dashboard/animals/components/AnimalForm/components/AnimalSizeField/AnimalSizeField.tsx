"use client";
import type { AnimalSize } from "@dniproanimals/contracts";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@dniproanimals/ui";
import { useFormContext } from "react-hook-form";
import type { AnimalFormValues } from "../../schema";
import { AnimalChipGroup, type ChipOption } from "../AnimalChipGroup";

const OPTIONS: ChipOption<AnimalSize>[] = [
  { value: "small", label: "Малий" },
  { value: "medium", label: "Середній" },
  { value: "large", label: "Великий" },
];

export function AnimalSizeField() {
  const { control } = useFormContext<AnimalFormValues>();
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
