"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@dniproanimals/ui";
import { useLostFormContext } from "../../hooks/useLostForm";

export function LostTitleField() {
  const { control } = useLostFormContext();
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
