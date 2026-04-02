"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const filterLabels: Record<string, string> = {
  dog: "🐕 Собаки",
  cat: "🐈 Коти",
  other: "🐾 Інше",
  male: "♂️ Хлопчик",
  female: "♀️ Дівчинка",
  small: "Малий",
  medium: "Середній",
  large: "Великий",
  vaccinated: "💉 Вакциновано",
  sterilized: "✂️ Стерилізовано",
  trained: "🎓 Навчено",
};

type ActiveFilter = { key: string; value: string; label: string };

export default function ActiveFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const active: ActiveFilter[] = [];

  // Multi-value params
  for (const key of ["type", "sex", "size"]) {
    const raw = searchParams.get(key);
    if (raw) {
      for (const v of raw.split(",").filter(Boolean)) {
        active.push({ key, value: v, label: filterLabels[v] || v });
      }
    }
  }
  // Boolean params
  for (const key of ["vaccinated", "sterilized", "trained"]) {
    if (searchParams.get(key) === "1") {
      active.push({ key, value: "1", label: filterLabels[key] });
    }
  }

  const removeFilter = useCallback(
    (filter: ActiveFilter) => {
      const params = new URLSearchParams(searchParams.toString());

      if (["vaccinated", "sterilized", "trained"].includes(filter.key)) {
        params.delete(filter.key);
      } else {
        const current = (params.get(filter.key) || "").split(",").filter(Boolean);
        const updated = current.filter((v) => v !== filter.value);
        if (updated.length > 0) {
          params.set(filter.key, updated.join(","));
        } else {
          params.delete(filter.key);
        }
      }

      router.push(`/?${params.toString()}`);
    },
    [router, searchParams]
  );

  const clearAll = useCallback(() => {
    const params = new URLSearchParams();
    const q = searchParams.get("q");
    if (q) params.set("q", q);
    router.push(`/?${params.toString()}`);
  }, [router, searchParams]);

  if (active.length === 0) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap mb-4">
      {/* Total badge */}
      <div className="flex items-center gap-1.5 mr-1">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-medium">
          <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="20" y2="12"/><line x1="12" y1="18" x2="20" y2="18"/>
          <circle cx="6" cy="6" r="2" fill="currentColor"/><circle cx="10" cy="12" r="2" fill="currentColor"/><circle cx="14" cy="18" r="2" fill="currentColor"/>
        </svg>
        <span className="text-xs font-medium text-gray-medium">Фільтри</span>
        <span className="w-5 h-5 rounded-full bg-[#ced48c] text-foreground text-[10px] font-bold flex items-center justify-center">
          {active.length}
        </span>
      </div>

      {/* Active filter chips */}
      {active.map((f, i) => (
        <button
          key={`${f.key}-${f.value}-${i}`}
          onClick={() => removeFilter(f)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#ced48c]/20 text-xs font-medium text-foreground hover:bg-[#ced48c]/40 transition-colors group"
        >
          {f.label}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-gray-400 group-hover:text-foreground transition-colors">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      ))}

      {/* Clear all */}
      <button
        onClick={clearAll}
        className="text-[11px] text-gray-medium hover:text-foreground transition-colors ml-1"
      >
        Скинути
      </button>
    </div>
  );
}
