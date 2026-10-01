"use client";

import {
  ANIMAL_COLORS,
  createCustomAnimalColor,
  getAnimalColorHex,
  getAnimalColorLabel,
  isValidHexColor,
  parseCustomAnimalColor,
} from "@/shared/constants";
import { IconChevronDown } from "@dniproanimals/icons";
import {
  Button,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@dniproanimals/ui";
import { useState } from "react";
import { useAnimalFormContext } from "../../hooks/useAnimalForm";

const DEFAULT_CUSTOM_COLOR = "#808080";

export function AnimalColorField() {
  const { control } = useAnimalFormContext();

  return (
    <FormField
      control={control}
      name="color"
      render={({ field }) => <AnimalColorFieldContent field={field} />}
    />
  );
}

function AnimalColorFieldContent({
  field,
}: {
  field: {
    value: string;
    onChange: (value: string) => void;
  };
}) {
  const [open, setOpen] = useState(false);
  const [pendingCustomColor, setPendingCustomColor] =
    useState(DEFAULT_CUSTOM_COLOR);
  const [pendingCustomName, setPendingCustomName] = useState("");

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      const currentColor = field.value;
      const customColor = parseCustomAnimalColor(currentColor);

      if (customColor) {
        setPendingCustomColor(customColor.hex.toUpperCase());
        setPendingCustomName(customColor.name);
      } else {
        setPendingCustomColor(
          isValidHexColor(currentColor)
            ? currentColor.toUpperCase()
            : DEFAULT_CUSTOM_COLOR,
        );
        setPendingCustomName(
          ANIMAL_COLORS.some((color) => color.value === currentColor) ||
            isValidHexColor(currentColor)
            ? ""
            : currentColor,
        );
      }
    }

    setOpen(nextOpen);
  };

  const previewColor = getAnimalColorHex(field.value);

  return (
    <FormItem>
      <FormLabel>Колір</FormLabel>

      <Popover open={open} onOpenChange={handleOpenChange}>
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

                {field.value
                  ? getAnimalColorLabel(field.value)
                  : "Оберіть колір"}
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

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-border bg-gray-light">
            <Input
              value={pendingCustomName}
              onChange={(event) => setPendingCustomName(event.target.value)}
              placeholder="Назва кольору"
              aria-label="Назва власного кольору"
              size="sm"
              className="flex-1 border-0 bg-transparent px-1 shadow-none"
            />

            <span
              className="size-4 rounded-full border shrink-0"
              style={{ backgroundColor: pendingCustomColor }}
            />

            <input
              type="color"
              value={pendingCustomColor}
              onChange={(event) => {
                setPendingCustomColor(event.target.value.toUpperCase());
              }}
              className="size-7 cursor-pointer border-0 p-0 bg-transparent"
              aria-label="Вибрати власний колір"
            />
          </div>

          <div className="border-t mt-1 pt-1">
            <Button
              type="button"
              variant="primary"
              size="sm"
              className="w-full"
              onClick={() => {
                field.onChange(
                  pendingCustomName.trim()
                    ? createCustomAnimalColor(
                        pendingCustomName,
                        pendingCustomColor,
                      )
                    : pendingCustomColor,
                );
                setOpen(false);
              }}
            >
              Підтвердити
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <FormMessage />
    </FormItem>
  );
}
