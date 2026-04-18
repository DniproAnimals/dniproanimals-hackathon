"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Textarea,
} from "@dniproanimals/ui";
import { useLostFormContext } from "../../hooks/useLostForm";

export function LostDescriptionField() {
  const { control } = useLostFormContext();
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
