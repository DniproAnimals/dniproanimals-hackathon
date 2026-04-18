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
  { value: "male", label: "Хлопчик" },
  { value: "female", label: "Дівчинка" },
];

export function AnimalSexField() {
  const { control } = useAnimalFormContext();
  return (
    <FormField
      control={control}
      name="sex"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Стать</FormLabel>
          <FormControl>
            <AnimalChipGroup
              options={OPTIONS}
              value={field.value}
              onChange={field.onChange}
              className="grid-cols-2"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
