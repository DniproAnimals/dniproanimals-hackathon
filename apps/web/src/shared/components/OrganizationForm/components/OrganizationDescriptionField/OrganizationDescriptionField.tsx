"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Textarea,
} from "@dniproanimals/ui";
import { useOrganizationFormContext } from "../../hooks/useOrganizationForm";

export function OrganizationDescriptionField() {
  const { control } = useOrganizationFormContext();
  return (
    <FormField
      control={control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Опис</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Розкажіть про діяльність, місію та особливості..."
              rows={4}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
