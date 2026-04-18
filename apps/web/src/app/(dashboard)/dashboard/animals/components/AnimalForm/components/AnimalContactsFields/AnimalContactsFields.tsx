"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
} from "@dniproanimals/ui";
import { useAnimalFormContext } from "../../hooks/useAnimalForm";

const FIELDS = [
  { name: "contactName", type: "text", placeholder: "Ім'я" },
  { name: "contactPhone", type: "tel", placeholder: "Телефон" },
  { name: "contactEmail", type: "email", placeholder: "Email" },
  { name: "contactLocation", type: "text", placeholder: "Місто / район" },
] as const;

export function AnimalContactsFields() {
  const { control } = useAnimalFormContext();
  return (
    <div>
      <p className="text-sm font-semibold text-gray-medium uppercase tracking-wider mb-2">
        Контакти
      </p>
      <div className="space-y-2.5">
        {FIELDS.map((f) => (
          <FormField
            key={f.name}
            control={control}
            name={f.name}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type={f.type} placeholder={f.placeholder} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </div>
    </div>
  );
}
