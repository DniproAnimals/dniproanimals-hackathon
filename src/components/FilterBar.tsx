"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

type FilterOption = { value: string; label: string; icon?: string };

type FilterSection = {
  key: string;
  label: string;
  icon: string;
  options: FilterOption[];
};

const filterSections: FilterSection[] = [
  {
    key: "type",
    label: "Категорія",
    icon: "🐾",
    options: [
      { value: "dog", label: "Собаки", icon: "🐕" },
      { value: "cat", label: "Коти", icon: "🐈" },
      { value: "other", label: "Інше", icon: "🐾" },
    ],
  },
  {
    key: "sex",
    label: "Стать",
    icon: "⚤",
    options: [
      { value: "male", label: "Хлопчик", icon: "♂️" },
      { value: "female", label: "Дівчинка", icon: "♀️" },
    ],
  },
  {
    key: "size",
    label: "Розмір",
    icon: "📏",
    options: [
      { value: "small", label: "Малий", icon: "🐁" },
      { value: "medium", label: "Середній", icon: "🐕" },
      { value: "large", label: "Великий", icon: "🦮" },
    ],
  },
  {
    key: "extra",
    label: "Додатково",
    icon: "⚙️",
    options: [
      { value: "vaccinated", label: "Вакциновано", icon: "💉" },
      { value: "sterilized", label: "Стерилізовано", icon: "✂️" },
      { value: "trained", label: "Навчено командам", icon: "🎓" },
    ],
  },
];

// Flat map for chip labels
const allLabels: Record<string, string> = {};
filterSections.forEach((s) =>
  s.options.forEach((o) => {
    allLabels[`${s.key}:${o.value}`] = o.label;
  })
);

export default function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    type: true,
    sex: true,
    size: true,
    extra: true,
  });

  const getValues = useCallback(
    (key: string): string[] => {
      if (key === "extra") {
        const vals: string[] = [];
        if (searchParams.get("vaccinated") === "1") vals.push("vaccinated");
        if (searchParams.get("sterilized") === "1") vals.push("sterilized");
        if (searchParams.get("trained") === "1") vals.push("trained");
        return vals;
      }
      const raw = searchParams.get(key);
      if (!raw) return [];
      return raw.split(",").filter(Boolean);
    },
    [searchParams]
  );

  const toggleValue = useCallback(
    (sectionKey: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (sectionKey === "extra") {
        if (params.get(value) === "1") {
          params.delete(value);
        } else {
          params.set(value, "1");
        }
      } else {
        const current = getValues(sectionKey);
        const idx = current.indexOf(value);
        if (idx >= 0) {
          current.splice(idx, 1);
        } else {
          current.push(value);
        }
        if (current.length > 0) {
          params.set(sectionKey, current.join(","));
        } else {
          params.delete(sectionKey);
        }
      }
      router.push(`/?${params.toString()}`);
    },
    [router, searchParams, getValues]
  );

  const removeChip = useCallback(
    (sectionKey: string, value: string) => {
      toggleValue(sectionKey, value);
    },
    [toggleValue]
  );

  const currentSearch = searchParams.get("q") || "";
  const updateSearch = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("q", value);
      } else {
        params.delete("q");
      }
      router.push(`/?${params.toString()}`);
    },
    [router, searchParams]
  );

  // Collect all active chips
  const activeChips: { sectionKey: string; value: string; label: string }[] = [];
  filterSections.forEach((s) => {
    const vals = getValues(s.key);
    vals.forEach((v) => {
      activeChips.push({
        sectionKey: s.key,
        value: v,
        label: allLabels[`${s.key}:${v}`] || v,
      });
    });
  });

  const totalActive = activeChips.length;

  return (
    <div>
      {/* Search */}
      <div className="relative mb-4">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="text"
          placeholder="Пошук..."
          value={currentSearch}
          onChange={(e) => updateSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-gray-border focus:ring-2 focus:ring-[#ced48c]/40 focus:border-[#ced48c] outline-none text-sm placeholder:text-gray-medium"
        />
      </div>

      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-medium">
          <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="20" y2="12"/><line x1="12" y1="18" x2="20" y2="18"/>
          <circle cx="6" cy="6" r="2" fill="currentColor"/><circle cx="10" cy="12" r="2" fill="currentColor"/><circle cx="14" cy="18" r="2" fill="currentColor"/>
        </svg>
        <span className="text-sm font-semibold text-foreground">Фільтри</span>
        {totalActive > 0 && (
          <span className="w-5 h-5 rounded-full bg-[#ced48c] text-foreground text-[10px] font-bold flex items-center justify-center">
            {totalActive}
          </span>
        )}
        {totalActive > 0 && (
          <button
            onClick={() => {
              const params = new URLSearchParams();
              const q = searchParams.get("q");
              if (q) params.set("q", q);
              router.push(`/?${params.toString()}`);
            }}
            className="ml-auto text-[11px] text-gray-medium hover:text-foreground transition-colors"
          >
            Скинути
          </button>
        )}
      </div>

      {/* Active chips */}
      {activeChips.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3 pb-3 border-b border-gray-border">
          {activeChips.map((chip) => (
            <button
              key={`${chip.sectionKey}-${chip.value}`}
              onClick={() => removeChip(chip.sectionKey, chip.value)}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#ced48c]/20 text-[11px] font-medium text-foreground hover:bg-[#ced48c]/40 transition-colors group"
            >
              {chip.label}
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-gray-400 group-hover:text-foreground">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          ))}
        </div>
      )}

      {/* Sections */}
      <div className="space-y-0">
        {filterSections.map((section) => {
          const values = getValues(section.key);
          const isOpen = openSections[section.key];

          return (
            <div key={section.key}>
              {/* Section header */}
              <button
                onClick={() =>
                  setOpenSections((prev) => ({ ...prev, [section.key]: !prev[section.key] }))
                }
                className="w-full flex items-center gap-2 py-2.5 text-left"
              >
                <span className="text-sm">{section.icon}</span>
                <span className="text-[13px] font-medium text-foreground">{section.label}</span>
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
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`ml-auto text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {/* Options list */}
              {isOpen && (
                <div className="pb-2 space-y-0.5">
                  {section.options.map((opt) => {
                    const isSelected = values.includes(opt.value);
                    return (
                      <button
                        key={opt.value}
                        onClick={() => toggleValue(section.key, opt.value)}
                        className="w-full flex items-center justify-between pl-7 pr-2 py-2 rounded-lg text-sm text-left hover:bg-gray-light transition-colors"
                      >
                        <span className={`flex items-center gap-2 ${isSelected ? "font-medium text-foreground" : "text-foreground"}`}>
                          {opt.icon && <span className="text-sm w-5 text-center">{opt.icon}</span>}
                          {opt.label}
                        </span>
                        {isSelected && (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ced48c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
