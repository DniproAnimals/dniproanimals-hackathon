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
  { value: "dog", label: "🐕 Собака" },
  { value: "cat", label: "🐈 Кіт" },
  { value: "other", label: "🐾 Інше" },
];

export function AnimalTypeField() {
  const { control, setValue } = useAnimalFormContext();
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
