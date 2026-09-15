"use client";
import { useSpeciesQuery } from "@/shared/query-hooks";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@dniproanimals/ui";
import { useAnimalFormContext } from "../../hooks/useAnimalForm";
import { AnimalChipGroup } from "../AnimalChipGroup";

export function AnimalTypeField() {
  const { control, setValue } = useAnimalFormContext();
  const { data: species = [] } = useSpeciesQuery();

  const options = species.map((s) => {
    let emoji = "🐾";
    if (s.value === "dog") emoji = "🐕";
    else if (s.value === "cat") emoji = "🐈";
    return {
      value: s.value,
      label: `${emoji} ${s.name}`,
    };
  });

  return (
    <FormField
      control={control}
      name="type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Вид *</FormLabel>
          <FormControl>
            <AnimalChipGroup
              options={options}
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
