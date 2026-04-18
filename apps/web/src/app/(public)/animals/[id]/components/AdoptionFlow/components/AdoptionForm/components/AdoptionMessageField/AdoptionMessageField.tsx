"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Textarea,
} from "@dniproanimals/ui";
import { useFormContext } from "react-hook-form";
import type { AdoptionFormValues } from "../../schema";

export function AdoptionMessageField() {
  const { control } = useFormContext<AdoptionFormValues>();
  return (
    <FormField
      control={control}
      name="message"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Textarea
              placeholder="Розкажіть про себе та умови утримання... *"
              rows={3}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
