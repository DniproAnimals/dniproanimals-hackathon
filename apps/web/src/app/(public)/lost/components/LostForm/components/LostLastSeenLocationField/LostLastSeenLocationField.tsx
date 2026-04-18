"use client";
import { IconMapPin } from "@dniproanimals/icons";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  InputWithIcon,
} from "@dniproanimals/ui";
import { useFormContext } from "react-hook-form";
import type { LostFormValues } from "../../schema";

export function LostLastSeenLocationField() {
  const { control, setValue } = useFormContext<LostFormValues>();
  return (
    <FormField
      control={control}
      name="lastSeenLocation"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Де востаннє бачили? *</FormLabel>
          <FormControl>
            <InputWithIcon icon={<IconMapPin size={16} />}>
              <Input
                type="text"
                placeholder="Адреса або район"
                value={field.value}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  setValue("location", e.target.value);
                }}
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
              />
            </InputWithIcon>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
