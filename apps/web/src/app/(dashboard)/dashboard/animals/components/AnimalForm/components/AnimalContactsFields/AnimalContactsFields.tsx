"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
} from "@dniproanimals/ui";
import { useFormContext } from "react-hook-form";
import type { AnimalFormValues } from "../../schema";

type ContactFieldName =
  | "contactName"
  | "contactPhone"
  | "contactEmail"
  | "contactLocation";

const FIELDS: {
  name: ContactFieldName;
  type: "text" | "tel" | "email";
  placeholder: string;
}[] = [
  { name: "contactName", type: "text", placeholder: "Ім'я" },
  { name: "contactPhone", type: "tel", placeholder: "Телефон" },
  { name: "contactEmail", type: "email", placeholder: "Email" },
  { name: "contactLocation", type: "text", placeholder: "Місто / район" },
];

export function AnimalContactsFields() {
  const { control } = useFormContext<AnimalFormValues>();
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
