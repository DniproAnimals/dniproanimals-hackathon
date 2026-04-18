"use client";
import { CAT_BREEDS_WITH_MIX, DOG_BREEDS_WITH_MIX } from "@/shared/constants";
import { IconCheck, IconChevronDown } from "@dniproanimals/icons";
import {
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
import { useFormContext, useWatch } from "react-hook-form";
import type { LostFormValues } from "../../constants/schema";

export function LostBreedField() {
  const { control } = useFormContext<LostFormValues>();
  const animalType = useWatch({ control, name: "animalType" });
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  if (!animalType || animalType === "Інше") return null;

  const breeds =
    animalType === "Кіт" ? CAT_BREEDS_WITH_MIX : DOG_BREEDS_WITH_MIX;
  const filtered = search
    ? breeds.filter((b) => b.toLowerCase().includes(search.toLowerCase()))
    : breeds;

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
              className="p-0 w-(--radix-popover-trigger-width)"
            >
              <div className="p-2 border-b border-gray-border">
                <Input
                  type="text"
                  size="sm"
                  placeholder="Пошук..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="max-h-36 overflow-auto py-1">
                {filtered.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => {
                      field.onChange(b);
                      setSearch("");
                      setOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-light"
                  >
                    {b}
                    {field.value === b && (
                      <IconCheck size={14} className="text-red-500" />
                    )}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
