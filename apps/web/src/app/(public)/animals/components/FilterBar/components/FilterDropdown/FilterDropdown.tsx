"use client";
import { IconCheck, IconChevronDown } from "@dniproanimals/icons";
import {
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  cn,
} from "@dniproanimals/ui";
import { useState } from "react";

export interface FilterDropdownOption {
  value: string;
  label: string;
  color?: string;
}

export interface FilterDropdownProps {
  label: string;
  icon: string;
  values: string[];
  options: FilterDropdownOption[];
  onToggle: (value: string) => void;
  search?: boolean;
  colorCircles?: boolean;
}

export function FilterDropdown({
  label,
  icon,
  values,
  options,
  onToggle,
  search,
  colorCircles,
}: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered =
    search && query
      ? options.filter((o) =>
          o.label.toLowerCase().includes(query.toLowerCase()),
        )
      : options;

  const displayText =
    values.length > 0
      ? colorCircles
        ? values.join(", ")
        : values
            .map((v) => options.find((o) => o.value === v)?.label || v)
            .join(", ")
      : "";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "w-full flex items-center justify-between px-3 py-2 rounded-xl border text-sm text-left transition-colors",
            open
              ? "border-primary ring-2 ring-primary/20 bg-white"
              : values.length > 0
                ? "border-primary bg-primary/5"
                : "border-gray-border bg-white hover:border-gray-medium",
          )}
        >
          <span className="flex items-center gap-2 min-w-0">
            <span className="text-xs shrink-0">{icon}</span>
            <span
              className={cn(
                "truncate text-xs",
                values.length > 0
                  ? "text-foreground font-medium"
                  : "text-gray-medium",
              )}
            >
              {displayText || label}
            </span>
          </span>
          <div className="flex items-center gap-1 shrink-0 ml-1">
            {values.length > 0 && (
              <span className="inline-flex size-4 items-center justify-center rounded-full bg-primary text-foreground text-[9px] font-bold">
                {values.length}
              </span>
            )}
            <IconChevronDown
              className={cn(
                "size-3 text-gray-medium transition-transform",
                open && "rotate-180",
              )}
            />
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-(--radix-popover-trigger-width) p-0 max-h-52 overflow-auto"
      >
        {search && (
          <div className="p-2 border-b border-gray-border">
            <Input
              size="sm"
              placeholder="Пошук..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="text-xs h-8"
              autoFocus
            />
          </div>
        )}
        {filtered.map((opt) => {
          const selected = values.includes(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onToggle(opt.value)}
              className="w-full flex items-center justify-between px-3 py-2 text-xs hover:bg-muted transition-colors"
            >
              <span className="flex items-center gap-2">
                {colorCircles && opt.color && (
                  <span
                    className="size-4 rounded-full border border-gray-border shrink-0"
                    style={{ backgroundColor: opt.color }}
                  />
                )}
                <span className={selected ? "font-medium" : ""}>
                  {opt.label}
                </span>
              </span>
              {selected && (
                <IconCheck className="size-3 text-primary" strokeWidth={3} />
              )}
            </button>
          );
        })}
        {search && filtered.length === 0 && (
          <p className="px-3 py-2 text-[11px] text-gray-medium">Не знайдено</p>
        )}
      </PopoverContent>
    </Popover>
  );
}
