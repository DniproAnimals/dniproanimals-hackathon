"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Textarea,
} from "@dniproanimals/ui";
import { useFormContext } from "react-hook-form";
import type { LostFormValues } from "../../constants/schema";

export function LostDescriptionField() {
  const { control } = useFormContext<LostFormValues>();
  return (
    <FormField
      control={control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Опис та прикмети *</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Зовнішність, нашийник, особливі прикмети..."
              rows={2}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
