"use client";
import {
  Checkbox,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@dniproanimals/ui";
import { useAnimalFormContext } from "../../hooks/useAnimalForm";

export function AnimalDonationField() {
  const form = useAnimalFormContext();

  return (
    <FormField
      control={form.control}
      name="donationsEnabled"
      render={({ field }) => (
        <FormItem className="rounded-xl border border-gray-border p-4">
          <div className="flex items-start gap-3">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
              />
            </FormControl>
            <div className="flex flex-col gap-1">
              <FormLabel>Увімкнути підтримку тварини</FormLabel>
              <FormDescription>
                Користувачі зможуть оформити пожертву та отримувати щомісячні
                фото й новини про тваринку.
              </FormDescription>
              <FormMessage />
            </div>
          </div>
        </FormItem>
      )}
    />
  );
}
