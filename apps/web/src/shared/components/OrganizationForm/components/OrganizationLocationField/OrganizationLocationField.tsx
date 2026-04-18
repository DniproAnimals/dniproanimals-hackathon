"use client";
import { IconMapPinFilled } from "@dniproanimals/icons";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  InputWithIcon,
} from "@dniproanimals/ui";
import { useOrganizationFormContext } from "../../hooks/useOrganizationForm";

export function OrganizationLocationField() {
  const { control } = useOrganizationFormContext();
  return (
    <FormField
      control={control}
      name="location"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Місцезнаходження</FormLabel>
          <FormControl>
            <InputWithIcon icon={<IconMapPinFilled />}>
              <Input type="text" placeholder="Місто / адреса" {...field} />
            </InputWithIcon>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
