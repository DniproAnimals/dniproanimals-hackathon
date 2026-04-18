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
import type { LostFormValues } from "../../schema";

export function LostLastSeenDateField() {
  const { control } = useFormContext<LostFormValues>();
  return (
    <FormField
      control={control}
      name="lastSeenDate"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Коли?</FormLabel>
          <FormControl>
            <Input type="date" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
