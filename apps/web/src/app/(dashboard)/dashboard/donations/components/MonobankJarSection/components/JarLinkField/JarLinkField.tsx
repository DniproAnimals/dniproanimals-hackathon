"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@dniproanimals/ui";
import { useDonateFormContext } from "../../hooks/useDonateForm";

export function JarLinkField() {
  const { control } = useDonateFormContext();
  return (
    <FormField
      control={control}
      name="url"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-xs text-gray-medium mb-1.5">
            Посилання на банку
          </FormLabel>
          <FormControl>
            <Input
              type="text"
              placeholder="https://send.monobank.ua/jar/jjJbZRhoQ"
              {...field}
            />
          </FormControl>
          <p className="text-xs text-gray-medium mt-1.5">
            Вставте посилання з додатку Monobank
          </p>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
