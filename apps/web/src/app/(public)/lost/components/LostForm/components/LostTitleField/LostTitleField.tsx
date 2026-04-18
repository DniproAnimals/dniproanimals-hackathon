"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@dniproanimals/ui";
import { useFormContext } from "react-hook-form";
import type { LostFormValues } from "../../constants/schema";

export function LostTitleField() {
  const { control } = useFormContext<LostFormValues>();
  return (
    <FormField
      control={control}
      name="title"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Хто загубився? *</FormLabel>
          <FormControl>
            <Input
              type="text"
              placeholder="Наприклад: Рудий кіт Мурчик"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
