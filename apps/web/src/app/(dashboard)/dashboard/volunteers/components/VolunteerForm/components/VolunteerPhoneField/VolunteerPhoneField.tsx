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

export function VolunteerPhoneField() {
  const { control } = useVolunteerFormContext();
  return (
    <FormField
      control={control}
      name="phone"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Телефон</FormLabel>
          <FormControl>
            <Input type="tel" placeholder="Телефон" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
