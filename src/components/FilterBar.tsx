"use client";

import Link from "next/link";
import { useQueryStates, parseAsString } from "nuqs";
import { useState, useRef, useEffect } from "react";

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

// Reusable dropdown component
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
  options: { value: string; label: string; color?: string }[];
  onToggle: (v: string) => void;
  search?: boolean;
  colorCircles?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

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
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl border text-sm text-left transition-colors ${
          open
            ? "border-[#ced48c] ring-2 ring-[#ced48c]/20 bg-white"
            : values.length > 0
              ? "border-[#ced48c] bg-[#ced48c]/5"
              : "border-gray-border bg-white hover:border-gray-400"
        }`}
      >
        <span className="flex items-center gap-2 min-w-0">
          <span className="text-xs shrink-0">{icon}</span>
          <span
            className={`truncate text-xs ${values.length > 0 ? "text-foreground font-medium" : "text-gray-medium"}`}
          >
            {displayText || label}
          </span>
        </span>
        <div className="flex items-center gap-1 shrink-0 ml-1">
          {values.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-[#ced48c] text-foreground text-[9px] font-bold flex items-center justify-center">
              {values.length}
            </span>
          )}
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </button>
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-gray-border shadow-lg z-30 py-1 max-h-52 overflow-auto">
          {search && (
            <div className="p-2 border-b border-gray-border">
              <input
                type="text"
                placeholder="Пошук..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-gray-light border-none outline-none text-xs"
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
                className="w-full flex items-center justify-between px-3 py-2 text-xs hover:bg-gray-light transition-colors"
              >
                <span className="flex items-center gap-2">
                  {colorCircles && opt.color && (
                    <span
                      className="w-4 h-4 rounded-full border border-gray-border shrink-0"
                      style={{ backgroundColor: opt.color }}
                    />
                  )}
                  <span className={sel ? "font-medium" : ""}>{opt.label}</span>
                </span>
                {sel && (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#ced48c"
                    strokeWidth="3"
                    strokeLinecap="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            );
          })}
          {search && filtered.length === 0 && (
            <p className="px-3 py-2 text-[11px] text-gray-medium">
              Не знайдено
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// Toggle value in comma-separated string
function toggleInList(current: string | null, value: string): string | null {
  const list = (current || "").split(",").filter(Boolean);
  const idx = list.indexOf(value);
  if (idx >= 0) list.splice(idx, 1);
  else list.push(value);
  return list.length > 0 ? list.join(",") : null;
}

// --- Props ---

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
  onReset,
}: FilterBarProps) {
  const [secondary, setSecondary] = useQueryStates(secondaryParsers);

  // Primary filters from slug (single-select)
  const typeValues = slugType ? [slugType] : [];
  const sexValues = slugSex ? [slugSex] : [];
  const sizeValues = slugSize ? [slugSize] : [];

  // Secondary filters from query params (multi-select)
  const breedValues = (secondary.breed || "").split(",").filter(Boolean);
  const colorValues = (secondary.color || "").split(",").filter(Boolean);
  const extraValues = [
    ...(secondary.vaccinated === "1" ? ["vaccinated"] : []),
    ...(secondary.sterilized === "1" ? ["sterilized"] : []),
    ...(secondary.trained === "1" ? ["trained"] : []),
  ];

  // Toggle primary (slug): single-select
  const togglePrimary = (key: string, value: string) => {
    const current =
      key === "type" ? slugType : key === "sex" ? slugSex : slugSize;
    onPrimaryChange(key, current === value ? null : value);
  };

  // Toggle secondary (query param): multi-select
  const toggleSecondary = (key: string, value: string) => {
    setSecondary({
      [key]: toggleInList(secondary[key as keyof typeof secondary], value),
    });
  };

  // Toggle extra boolean
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
      {/* Search */}
      <div className="relative">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="text"
          placeholder="Пошук..."
          value={secondary.q || ""}
          onChange={(e) => setSecondary({ q: e.target.value || null })}
          className="w-full pl-8 pr-3 py-2 rounded-xl bg-white border border-gray-border focus:ring-2 focus:ring-[#ced48c]/40 focus:border-[#ced48c] outline-none text-xs placeholder:text-gray-medium"
        />
      </div>

      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-gray-medium uppercase tracking-wider">
          Фільтри
        </span>
        {totalActive > 0 && (
          <span className="w-4 h-4 rounded-full bg-[#ced48c] text-foreground text-[9px] font-bold flex items-center justify-center">
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

      {/* Type (slug) */}
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

      {/* Breed (query param) */}
      <FilterDropdown
        label="Порода"
        icon="🏷️"
        values={breedValues}
        onToggle={(v) => toggleSecondary("breed", v)}
        search
        options={breedOptions.map((b) => ({ value: b, label: b }))}
      />

      {/* Sex (slug) */}
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

      {/* Size (slug) */}
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

      {/* Color (query param) */}
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

      {/* Extras (query param) */}
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

      {/* Active chips */}
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
            <button
              key={`${chip.key}-${chip.v}`}
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
              className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#ced48c]/20 text-[10px] font-medium text-foreground hover:bg-[#ced48c]/40 transition-colors"
            >
              {chip.label}
              <svg
                width="8"
                height="8"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                className="text-gray-400"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
