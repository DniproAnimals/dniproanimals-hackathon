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

export function VolunteerSurnameField() {
  const { control } = useVolunteerFormContext();
  return (
    <FormField
      control={control}
      name="surname"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Прізвище</FormLabel>
          <FormControl>
            <Input type="text" placeholder="Прізвище" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
