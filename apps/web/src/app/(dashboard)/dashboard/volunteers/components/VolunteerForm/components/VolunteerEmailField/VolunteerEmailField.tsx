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

export function VolunteerEmailField() {
  const { control } = useFormContext<VolunteerFormValues>();
  return (
    <FormField
      control={control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input type="email" placeholder="Email" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
