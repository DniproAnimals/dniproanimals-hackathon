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

const OPTIONS: ChipOption<"small" | "medium" | "large">[] = [
  { value: "small", label: "Малий" },
  { value: "medium", label: "Середній" },
  { value: "large", label: "Великий" },
];

export function LostSizeField() {
  const { control } = useLostFormContext();
  return (
    <FormField
      control={control}
      name="size"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Розмір</FormLabel>
          <FormControl>
            <LostChipGroup
              options={OPTIONS}
              value={field.value as "small" | "medium" | "large" | ""}
              onChange={field.onChange}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
