"use client";
import { useSpeciesQuery } from "@/shared/query-hooks";
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
  const type = useWatch({ control, name: "type" });
  const [open, setOpen] = useState(false);
  const [customBreed, setCustomBreed] = useState("");

  const { data: species = [] } = useSpeciesQuery();

  const selectedSpecies = species.find((s) => s.value === type);
  const breeds = selectedSpecies?.breeds?.map((b) => b.name) ?? [];

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
              className="w-(--radix-popover-trigger-width) p-2 max-h-72 overflow-auto flex flex-col gap-2 bg-white shadow-md border rounded-xl"
            >
              <div className="flex gap-1.5 p-1 border-b border-gray-100">
                <input
                  type="text"
                  placeholder="Власна порода..."
                  className="flex-1 px-2.5 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-hidden"
                  value={customBreed}
                  onChange={(e) => setCustomBreed(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (customBreed.trim()) {
                        field.onChange(customBreed.trim());
                        setCustomBreed("");
                        setOpen(false);
                      }
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customBreed.trim()) {
                      field.onChange(customBreed.trim());
                      setCustomBreed("");
                      setOpen(false);
                    }
                  }}
                  className="px-2.5 py-1.5 text-xs bg-primary text-white rounded-lg font-medium hover:bg-primary/90"
                >
                  Ок
                </button>
              </div>
              <div className="flex flex-col gap-0.5 max-h-48 overflow-auto">
                {breeds.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => {
                      field.onChange(b);
                      setOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-light rounded-lg text-left"
                  >
                    {b}
                    {field.value === b && (
                      <IconCheck size={14} className="text-primary" />
                    )}
                  </button>
                ))}
                {breeds.length === 0 && (
                  <span className="text-xs text-gray-500 p-2 text-center">
                    Немає збережених порід. Введіть власну вище.
                  </span>
                )}
              </div>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
