"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@dniproanimals/ui";
import { useOrganizationFormContext } from "../../hooks/useOrganizationForm";

export function OrganizationNameField() {
  const { control } = useOrganizationFormContext();
  return (
    <FormField
      control={control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Назва організації *</FormLabel>
          <FormControl>
            <Input
              type="text"
              placeholder="Наприклад: Притулок «Друг»"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
