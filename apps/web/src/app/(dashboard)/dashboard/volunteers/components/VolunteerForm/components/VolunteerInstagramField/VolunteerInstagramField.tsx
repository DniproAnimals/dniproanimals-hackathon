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
import type { VolunteerFormValues } from "../../schema";

export function VolunteerInstagramField() {
  const { control } = useFormContext<VolunteerFormValues>();
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
