"use client";

import {
  CAT_BREEDS_WITH_MIX,
  CUSTOM_BREED,
  DOG_BREEDS_WITH_MIX,
} from "@/shared/constants";
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
import { useWatch } from "react-hook-form";
import { useAnimalFormContext } from "../../hooks/useAnimalForm";

export function AnimalBreedField() {
  const { control } = useAnimalFormContext();

  const type = useWatch({
    control,
    name: "type",
  });

  const [open, setOpen] = useState(false);

  const breeds = type === "cat" ? CAT_BREEDS_WITH_MIX : DOG_BREEDS_WITH_MIX;

  // For "other" we don't show the breed dropdown.
  // The user gets a normal text field instead.
  if (type === "other") {
    return null;
  }

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
              {breeds.map((breed) => (
                <button
                  key={breed}
                  type="button"
                  onClick={() => {
                    field.onChange(breed);
                    setOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-light rounded-lg"
                >
                  <span>{breed}</span>

                  {field.value === breed && (
                    <IconCheck size={14} className="text-primary" />
                  )}
                </button>
              ))}

              <button
                type="button"
                onClick={() => {
                  field.onChange(CUSTOM_BREED);
                  setOpen(false);
                }}
                className="w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-light rounded-lg"
              >
                <span>Інша порода</span>

                {field.value === CUSTOM_BREED && (
                  <IconCheck size={14} className="text-primary" />
                )}
              </button>
            </PopoverContent>
          </Popover>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
