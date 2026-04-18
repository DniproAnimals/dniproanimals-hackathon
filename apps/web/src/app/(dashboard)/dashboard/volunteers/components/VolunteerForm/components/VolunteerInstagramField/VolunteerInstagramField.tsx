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

export function VolunteerInstagramField() {
  const { control } = useVolunteerFormContext();
  return (
    <FormField
      control={control}
      name="instagram"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Instagram</FormLabel>
          <FormControl>
            <Input type="text" placeholder="Instagram" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
