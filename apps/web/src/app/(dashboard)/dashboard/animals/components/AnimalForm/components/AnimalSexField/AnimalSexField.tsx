"use client";
import type { AnimalSex } from "@dniproanimals/contracts";
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

const OPTIONS: ChipOption<AnimalSex>[] = [
  { value: "male", label: "Хлопчик" },
  { value: "female", label: "Дівчинка" },
];

export function AnimalSexField() {
  const { control } = useFormContext<AnimalFormValues>();
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
              columns={2}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
