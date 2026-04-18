"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Textarea,
} from "@dniproanimals/ui";
import { useAdoptionFormContext } from "../../hooks/useAdoptionForm";

export function AdoptionMessageField() {
  const { control } = useAdoptionFormContext();
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
