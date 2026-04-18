"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@dniproanimals/ui";
import { useVolunteerFormContext } from "../../hooks/useVolunteerForm";

export function VolunteerNameField() {
  const { control } = useVolunteerFormContext();
  return (
    <FormField
      control={control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Ім&apos;я *</FormLabel>
          <FormControl>
            <Input type="text" placeholder="Ім'я" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
