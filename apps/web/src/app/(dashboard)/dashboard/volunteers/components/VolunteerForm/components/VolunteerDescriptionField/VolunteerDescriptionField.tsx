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
import type { VolunteerFormValues } from "../../schema";

export function VolunteerDescriptionField() {
  const { control } = useFormContext<VolunteerFormValues>();
  return (
    <FormField
      control={control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Опис</FormLabel>
          <FormControl>
            <Textarea placeholder="Чим займається" rows={2} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
