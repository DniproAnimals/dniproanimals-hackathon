"use client";
import type { AnimalType } from "@dniproanimals/contracts";
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

const OPTIONS: ChipOption<AnimalType>[] = [
  { value: "dog", label: "🐕 Собака" },
  { value: "cat", label: "🐈 Кіт" },
  { value: "other", label: "🐾 Інше" },
];

export function AnimalTypeField() {
  const { control, setValue } = useFormContext<AnimalFormValues>();
  return (
    <FormField
      control={control}
      name="type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Вид *</FormLabel>
          <FormControl>
            <AnimalChipGroup
              options={OPTIONS}
              value={field.value}
              onChange={(v) => {
                field.onChange(v);
                setValue("breed", "");
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
