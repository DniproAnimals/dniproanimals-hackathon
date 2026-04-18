"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@dniproanimals/ui";
import { useVolunteerFormContext } from "../../hooks/useVolunteerForm";

export function VolunteerTelegramField() {
  const { control } = useVolunteerFormContext();
  return (
    <FormField
      control={control}
      name="telegram"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Telegram</FormLabel>
          <FormControl>
            <Input type="text" placeholder="Telegram" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
