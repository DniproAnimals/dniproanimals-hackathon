"use client";
import { CAT_BREEDS_WITH_MIX, DOG_BREEDS_WITH_MIX } from "@/shared/constants";
import { IconCheck, IconChevronDown } from "@dniproanimals/icons";
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
import { useFormContext, useWatch } from "react-hook-form";
import type { AnimalFormValues } from "../../schema";

export function AnimalBreedField() {
  const { control } = useFormContext<AnimalFormValues>();
  const type = useWatch({ control, name: "type" });
  const [open, setOpen] = useState(false);

  const breeds = type === "cat" ? CAT_BREEDS_WITH_MIX : DOG_BREEDS_WITH_MIX;

  return (
    <FormField
      control={control}
      name="breed"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Порода</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <button
                  type="button"
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm text-left border-gray-border bg-gray-light"
                >
                  <span>{field.value || "Оберіть породу"}</span>
                  <IconChevronDown size={14} />
                </button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="w-(--radix-popover-trigger-width) p-1 max-h-60 overflow-auto"
            >
              {breeds.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => {
                    field.onChange(b);
                    setOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-light rounded-lg"
                >
                  {b}
                  {field.value === b && (
                    <IconCheck size={14} className="text-primary" />
                  )}
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
