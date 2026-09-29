"use client";

import {
  ANIMAL_COLORS,
  getAnimalColorHex,
  isValidHexColor,
} from "@/shared/constants";
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
import { useAnimalFormContext } from "../../hooks/useAnimalForm";

const DEFAULT_CUSTOM_COLOR = "#808080";

export function AnimalColorField() {
  const { control } = useAnimalFormContext();
  const [open, setOpen] = useState(false);

  return (
    <FormField
      control={control}
      name="color"
      render={({ field }) => {
        const customColor = isValidHexColor(field.value)
          ? field.value
          : DEFAULT_CUSTOM_COLOR;

        const previewColor = getAnimalColorHex(field.value);

        return (
          <FormItem>
            <FormLabel>Колір</FormLabel>

            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <button
                    type="button"
                    className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm text-left border-gray-border bg-gray-light"
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className="size-4 rounded-full border"
                        style={{ backgroundColor: previewColor }}
                      />

                      {field.value || "Оберіть колір"}
                    </span>

                    <IconChevronDown size={14} />
                  </button>
                </FormControl>
              </PopoverTrigger>

              <PopoverContent align="start" className="p-1">
                {ANIMAL_COLORS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => {
                      field.onChange(color.value);
                      setOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-light rounded-lg"
                  >
                    <span
                      className="size-4 rounded-full border"
                      style={{ backgroundColor: color.hex }}
                    />

                    {color.value}
                  </button>
                ))}

                <div className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-light rounded-lg">
                  <span
                    className="size-4 rounded-full border shrink-0"
                    style={{ backgroundColor: customColor }}
                  />

                  <span className="flex-1">Свій колір</span>

                  <input
                    type="color"
                    value={customColor}
                    onChange={(event) => {
                      field.onChange(event.target.value.toUpperCase());
                      setOpen(false);
                    }}
                    className="size-7 cursor-pointer border-0 p-0 bg-transparent"
                    aria-label="Вибрати власний колір"
                  />
                </div>
              </PopoverContent>
            </Popover>

            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
