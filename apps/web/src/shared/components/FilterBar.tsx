"use client";
import { cn } from "@dniproanimals/ui";
import {
  IconCheck,
  IconChevronDown,
  IconSearch,
  IconX,
} from "@dniproanimals/icons";
import {
  FilterChip,
  Input,
  InputWithIcon,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@dniproanimals/ui";
import Link from "next/link";
import { parseAsString, useQueryStates } from "nuqs";
import { useState } from "react";

const breedOptions = [
  "Німецька вівчарка",
  "Лабрадор",
  "Стаффордширський тер'єр",
  "Хаскі",
  "Бульдог",
  "Такса",
  "Чихуахуа",
  "Коргі",
  "Мопс",
  "Європейська короткошерста",
  "Ангорська",
  "Мейн-кун",
  "Сфінкс",
  "Бенгальська",
  "Мікс",
];

const colorOptions = [
  { value: "Білий", color: "#ffffff" },
  { value: "Чорний", color: "#1a1a1a" },
  { value: "Сірий", color: "#9e9e9e" },
  { value: "Рудий", color: "#c45e1a" },
  { value: "Коричневий", color: "#6d4c2e" },
  { value: "Золотистий", color: "#d4a017" },
  { value: "Кремовий", color: "#f5deb3" },
  { value: "Тигровий", color: "#8B6914" },
];

type Option = { value: string; label: string; color?: string };

function FilterDropdown({
  label,
  icon,
  values,
  options,
  onToggle,
  search,
  colorCircles,
}: {
  label: string;
  icon: string;
  values: string[];
  options: Option[];
  onToggle: (v: string) => void;
  search?: boolean;
  colorCircles?: boolean;
}) {
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
          const sel = values.includes(opt.value);
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
                <span className={sel ? "font-medium" : ""}>{opt.label}</span>
              </span>
              {sel && (
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

function toggleInList(current: string | null, value: string): string | null {
  const list = (current || "").split(",").filter(Boolean);
  const idx = list.indexOf(value);
  if (idx >= 0) list.splice(idx, 1);
  else list.push(value);
  return list.length > 0 ? list.join(",") : null;
}

type FilterBarProps = {
  slugType: string | null;
  slugSex: string | null;
  slugSize: string | null;
  onPrimaryChange: (key: string, value: string | null) => void;
  onReset: () => void;
};

const secondaryParsers = {
  breed: parseAsString,
  color: parseAsString,
  vaccinated: parseAsString,
  sterilized: parseAsString,
  trained: parseAsString,
  q: parseAsString,
};

export default function FilterBar({
  slugType,
  slugSex,
  slugSize,
  onPrimaryChange,
}: FilterBarProps) {
  const [secondary, setSecondary] = useQueryStates(secondaryParsers);

  const typeValues = slugType ? [slugType] : [];
  const sexValues = slugSex ? [slugSex] : [];
  const sizeValues = slugSize ? [slugSize] : [];

  const breedValues = (secondary.breed || "").split(",").filter(Boolean);
  const colorValues = (secondary.color || "").split(",").filter(Boolean);
  const extraValues = [
    ...(secondary.vaccinated === "1" ? ["vaccinated"] : []),
    ...(secondary.sterilized === "1" ? ["sterilized"] : []),
    ...(secondary.trained === "1" ? ["trained"] : []),
  ];

  const togglePrimary = (key: string, value: string) => {
    const current =
      key === "type" ? slugType : key === "sex" ? slugSex : slugSize;
    onPrimaryChange(key, current === value ? null : value);
  };

  const toggleSecondary = (key: string, value: string) => {
    setSecondary({
      [key]: toggleInList(secondary[key as keyof typeof secondary], value),
    });
  };

  const toggleExtra = (value: string) => {
    const cur = secondary[value as keyof typeof secondary];
    setSecondary({ [value]: cur === "1" ? null : "1" });
  };

  const totalActive =
    typeValues.length +
    sexValues.length +
    sizeValues.length +
    breedValues.length +
    colorValues.length +
    extraValues.length;

  return (
    <div className="space-y-2.5">
      <InputWithIcon icon={<IconSearch />}>
        <Input
          size="sm"
          type="text"
          placeholder="Пошук..."
          value={secondary.q || ""}
          onChange={(e) => setSecondary({ q: e.target.value || null })}
          className="bg-white text-xs"
        />
      </InputWithIcon>

      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-gray-medium uppercase tracking-wider">
          Фільтри
        </span>
        {totalActive > 0 && (
          <span className="inline-flex size-4 items-center justify-center rounded-full bg-primary text-foreground text-[9px] font-bold">
            {totalActive}
          </span>
        )}
        {totalActive > 0 && (
          <Link
            href="/animals"
            className="ml-auto text-[10px] text-gray-medium hover:text-foreground transition-colors"
          >
            Скинути
          </Link>
        )}
      </div>

      <FilterDropdown
        label="Категорія"
        icon="🐾"
        values={typeValues}
        onToggle={(v) => togglePrimary("type", v)}
        options={[
          { value: "dog", label: "🐕 Собаки" },
          { value: "cat", label: "🐈 Коти" },
          { value: "other", label: "🐾 Інше" },
        ]}
      />

      <FilterDropdown
        label="Порода"
        icon="🏷️"
        values={breedValues}
        onToggle={(v) => toggleSecondary("breed", v)}
        search
        options={breedOptions.map((b) => ({ value: b, label: b }))}
      />

      <FilterDropdown
        label="Стать"
        icon="⚤"
        values={sexValues}
        onToggle={(v) => togglePrimary("sex", v)}
        options={[
          { value: "male", label: "♂️ Хлопчик" },
          { value: "female", label: "♀️ Дівчинка" },
        ]}
      />

      <FilterDropdown
        label="Розмір"
        icon="📏"
        values={sizeValues}
        onToggle={(v) => togglePrimary("size", v)}
        options={[
          { value: "small", label: "Малий" },
          { value: "medium", label: "Середній" },
          { value: "large", label: "Великий" },
        ]}
      />

      <FilterDropdown
        label="Колір"
        icon="🎨"
        values={colorValues}
        onToggle={(v) => toggleSecondary("color", v)}
        colorCircles
        options={colorOptions.map((c) => ({
          value: c.value,
          label: c.value,
          color: c.color,
        }))}
      />

      <FilterDropdown
        label="Додатково"
        icon="⚙️"
        values={extraValues}
        onToggle={toggleExtra}
        options={[
          { value: "vaccinated", label: "💉 Вакциновано" },
          { value: "sterilized", label: "✂️ Стерилізовано" },
          { value: "trained", label: "🎓 Навчено" },
        ]}
      />

      {totalActive > 0 && (
        <div className="flex flex-wrap gap-1 pt-1">
          {[
            ...typeValues.map((v) => ({
              key: "type",
              v,
              label: v === "dog" ? "Собаки" : v === "cat" ? "Коти" : "Інше",
            })),
            ...sexValues.map((v) => ({
              key: "sex",
              v,
              label: v === "male" ? "Хлопчик" : "Дівчинка",
            })),
            ...sizeValues.map((v) => ({
              key: "size",
              v,
              label:
                v === "small"
                  ? "Малий"
                  : v === "medium"
                    ? "Середній"
                    : "Великий",
            })),
            ...breedValues.map((v) => ({ key: "breed", v, label: v })),
            ...colorValues.map((v) => ({ key: "color", v, label: v })),
            ...extraValues.map((v) => ({
              key: "extra",
              v,
              label:
                v === "vaccinated"
                  ? "Вакциновано"
                  : v === "sterilized"
                    ? "Стерилізовано"
                    : "Навчено",
            })),
          ].map((chip) => (
            <FilterChip
              key={`${chip.key}-${chip.v}`}
              size="sm"
              onClick={() => {
                if (
                  chip.key === "type" ||
                  chip.key === "sex" ||
                  chip.key === "size"
                )
                  togglePrimary(chip.key, chip.v);
                else if (chip.key === "extra") toggleExtra(chip.v);
                else toggleSecondary(chip.key, chip.v);
              }}
            >
              {chip.label}
              <IconX className="size-2.5 text-gray-medium" strokeWidth={3} />
            </FilterChip>
          ))}
        </div>
      )}
    </div>
  );
}
