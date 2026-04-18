"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@dniproanimals/ui";
import { useLostFormContext } from "../../hooks/useLostForm";

export function LostLastSeenDateField() {
  const { control } = useLostFormContext();
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
