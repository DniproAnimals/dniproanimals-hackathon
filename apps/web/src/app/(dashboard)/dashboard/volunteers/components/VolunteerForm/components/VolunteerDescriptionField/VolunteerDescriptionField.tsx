"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Textarea,
} from "@dniproanimals/ui";
import { useVolunteerFormContext } from "../../hooks/useVolunteerForm";

export function VolunteerDescriptionField() {
  const { control } = useVolunteerFormContext();
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
