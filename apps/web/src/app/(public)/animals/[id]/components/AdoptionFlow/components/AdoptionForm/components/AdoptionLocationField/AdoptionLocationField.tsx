"use client";
import { IconMapPin } from "@dniproanimals/icons";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
  InputWithIcon,
} from "@dniproanimals/ui";
import { useFormContext } from "react-hook-form";
import type { AdoptionFormValues } from "../../schema";

export function AdoptionLocationField() {
  const { control } = useFormContext<AdoptionFormValues>();
  return (
    <FormField
      control={control}
      name="location"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <InputWithIcon icon={<IconMapPin size={16} />}>
              <Input type="text" placeholder="Місто / район" {...field} />
            </InputWithIcon>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
