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

const OPTIONS: ChipOption<"male" | "female">[] = [
  { value: "male", label: "Хлопчик" },
  { value: "female", label: "Дівчинка" },
];

export function LostSexField() {
  const { control } = useLostFormContext();
  return (
    <FormField
      control={control}
      name="sex"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Стать</FormLabel>
          <FormControl>
            <LostChipGroup
              options={OPTIONS}
              value={field.value as "male" | "female" | ""}
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
