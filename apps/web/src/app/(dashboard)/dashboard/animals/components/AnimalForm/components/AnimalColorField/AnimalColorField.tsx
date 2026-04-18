"use client";
import { ANIMAL_COLORS } from "@/shared/constants";
import { IconChevronDown } from "@dniproanimals/icons";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@dniproanimals/ui";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import type { AnimalFormValues } from "../../schema";

export function AnimalColorField() {
  const { control } = useFormContext<AnimalFormValues>();
  const [open, setOpen] = useState(false);

  return (
    <FormField
      control={control}
      name="color"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Колір</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <button
                  type="button"
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm text-left border-gray-border bg-gray-light"
                >
                  <span>{field.value || "Оберіть колір"}</span>
                  <IconChevronDown size={14} />
                </button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent align="start" className="p-1">
              {ANIMAL_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => {
                    field.onChange(c.value);
                    setOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-light rounded-lg"
                >
                  <span
                    className="size-4 rounded-full border"
                    style={{ backgroundColor: c.hex }}
                  />
                  {c.value}
                </button>
              ))}
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
