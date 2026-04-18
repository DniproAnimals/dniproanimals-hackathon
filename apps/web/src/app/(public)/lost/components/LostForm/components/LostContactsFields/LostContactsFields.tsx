"use client";
import { IconPhone, IconUser } from "@dniproanimals/icons";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
  InputWithIcon,
} from "@dniproanimals/ui";
import { useFormContext } from "react-hook-form";
import type { LostFormValues } from "../../schema";

export function LostContactsFields() {
  const { control } = useFormContext<LostFormValues>();
  return (
    <div className="pt-1 border-t border-gray-border">
      <p className="text-xs text-gray-medium mb-1.5 mt-2">Ваші контакти *</p>
      <div className="grid grid-cols-2 gap-2">
        <FormField
          control={control}
          name="contactName"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <InputWithIcon icon={<IconUser size={16} />}>
                  <Input type="text" placeholder="Ім'я" {...field} />
                </InputWithIcon>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="contactPhone"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <InputWithIcon icon={<IconPhone size={16} />}>
                  <Input type="tel" placeholder="Телефон" {...field} />
                </InputWithIcon>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
