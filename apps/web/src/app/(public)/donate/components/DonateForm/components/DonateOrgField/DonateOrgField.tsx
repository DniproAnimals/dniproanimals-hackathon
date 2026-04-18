"use client";
import { useOrganizationsQuery } from "@/shared/query-hooks";
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
  cn,
} from "@dniproanimals/ui";
import { useState } from "react";
import { useDonateFormContext } from "../../hooks/useDonateForm";

export function DonateOrgField() {
  const { control } = useDonateFormContext();
  const { data: organizations = [] } = useOrganizationsQuery();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  return (
    <FormField
      control={control}
      name="orgId"
      render={({ field }) => {
        const selected = organizations.find((o) => o.id === field.value);
        const filtered = organizations.filter((o) =>
          o.name.toLowerCase().includes(search.toLowerCase()),
        );

        return (
          <FormItem className="mb-5 relative z-10">
            <FormLabel className="block text-sm font-bold text-gray-700 mb-2">
              Кому допомагаємо?
            </FormLabel>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <button
                    type="button"
                    className={cn(
                      "w-full flex items-center justify-between bg-gray-50 border-2 rounded-2xl py-3 pl-4 pr-10 text-left outline-none transition-colors font-medium cursor-pointer relative",
                      open
                        ? "border-primary bg-white"
                        : "border-gray-200 hover:border-gray-300",
                    )}
                  >
                    <span className="truncate">
                      {selected?.name || "Оберіть організацію"}
                    </span>
                    <IconChevronDown
                      size={16}
                      className={cn(
                        "absolute right-4 text-gray-500 transition-transform",
                        open && "rotate-180",
                      )}
                    />
                  </button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                className="p-0 w-[var(--radix-popover-trigger-width)] rounded-2xl border-2 border-gray-200 max-h-60 overflow-hidden"
              >
                <div className="p-2 border-b border-gray-100">
                  <Input
                    type="text"
                    size="sm"
                    placeholder="Пошук організації..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="max-h-48 overflow-auto py-1">
                  {filtered.map((org) => (
                    <button
                      key={org.id}
                      type="button"
                      onClick={() => {
                        field.onChange(org.id);
                        setSearch("");
                        setOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-gray-50"
                    >
                      <span>{org.name}</span>
                      {field.value === org.id && (
                        <IconCheck size={14} className="text-primary" />
                      )}
                    </button>
                  ))}
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
