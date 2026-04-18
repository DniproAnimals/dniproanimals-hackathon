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
import { useAdoptionFormContext } from "../../hooks/useAdoptionForm";

export function AdoptionLocationField() {
  const { control } = useAdoptionFormContext();
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
