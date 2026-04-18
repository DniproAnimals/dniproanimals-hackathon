"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@dniproanimals/ui";
import { useLostFormContext } from "../../hooks/useLostForm";
import { LostChipGroup, type ChipOption } from "../LostChipGroup";

const OPTIONS: ChipOption<"Собака" | "Кіт" | "Інше">[] = [
  { value: "Собака", label: "🐕 Собака" },
  { value: "Кіт", label: "🐈 Кіт" },
  { value: "Інше", label: "🐾 Інше" },
];

export function LostAnimalTypeField() {
  const { control, setValue } = useLostFormContext();
  return (
    <FormField
      control={control}
      name="animalType"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Вид</FormLabel>
          <FormControl>
            <LostChipGroup
              options={OPTIONS}
              value={field.value as "Собака" | "Кіт" | "Інше" | ""}
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
