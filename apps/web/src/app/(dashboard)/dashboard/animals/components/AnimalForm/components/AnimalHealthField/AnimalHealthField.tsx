"use client";
import {
  Checkbox,
  cn,
  FormField,
  FormItem,
  FormLabel,
} from "@dniproanimals/ui";
import { useFormContext } from "react-hook-form";
import type { AnimalFormValues } from "../../schema";

type HealthKey = "vaccinated" | "sterilized" | "trained";
const OPTIONS: { key: HealthKey; label: string; icon: string }[] = [
  { key: "vaccinated", label: "Вакциновано", icon: "💉" },
  { key: "sterilized", label: "Стерилізовано", icon: "✂️" },
  { key: "trained", label: "Навчено", icon: "🎓" },
];

export function AnimalHealthField() {
  const { control } = useFormContext<AnimalFormValues>();
  return (
    <FormItem>
      <FormLabel>Здоров&apos;я</FormLabel>
      <div className="flex flex-wrap gap-3">
        {OPTIONS.map((opt) => (
          <FormField
            key={opt.key}
            control={control}
            name={opt.key}
            render={({ field }) => (
              <label
                className={cn(
                  "flex items-center gap-2.5 cursor-pointer px-4 py-2.5 rounded-xl border transition-all text-sm",
                  field.value
                    ? "bg-primary/20 border-primary"
                    : "bg-white border-gray-border hover:border-primary",
                )}
              >
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(v) => field.onChange(!!v)}
                />
                <span>
                  {opt.icon} {opt.label}
                </span>
              </label>
            )}
          />
        ))}
      </div>
    </FormItem>
  );
}
