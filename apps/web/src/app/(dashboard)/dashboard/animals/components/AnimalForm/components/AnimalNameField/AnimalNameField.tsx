"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@dniproanimals/ui";
import { useAnimalFormContext } from "../../hooks/useAnimalForm";

export function AnimalNameField() {
  const { control } = useAnimalFormContext();
  return (
    <FormField
      control={control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Ім&apos;я *</FormLabel>
          <FormControl>
            <Input type="text" placeholder="Ім'я тварини" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
