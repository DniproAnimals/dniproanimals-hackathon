"use client";
import { FilterChip } from "@/components/ui/filter-chip";
import { IconAdjustmentsHorizontal } from "@tabler/icons-react";
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

  for (const key of ["type", "sex", "size"]) {
    const raw = searchParams.get(key);
    if (raw) {
      for (const v of raw.split(",").filter(Boolean)) {
        active.push({ key, value: v, label: filterLabels[v] || v });
      }
    }
  }
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
        const current = (params.get(filter.key) || "")
          .split(",")
          .filter(Boolean);
        const updated = current.filter((v) => v !== filter.value);
        if (updated.length > 0) {
          params.set(filter.key, updated.join(","));
        } else {
          params.delete(filter.key);
        }
      }

      router.push(`/?${params.toString()}`);
    },
    [router, searchParams],
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
      <div className="flex items-center gap-1.5 mr-1 text-gray-medium">
        <IconAdjustmentsHorizontal className="size-3.5" />
        <span className="text-xs font-medium">Фільтри</span>
        <span className="inline-flex size-5 items-center justify-center rounded-full bg-primary text-foreground text-[10px] font-bold">
          {active.length}
        </span>
      </div>

      {active.map((f, i) => (
        <FilterChip
          key={`${f.key}-${f.value}-${i}`}
          onClick={() => removeFilter(f)}
          onRemove={() => removeFilter(f)}
        >
          {f.label}
        </FilterChip>
      ))}

      <button
        onClick={clearAll}
        className="text-[11px] text-gray-medium hover:text-foreground transition-colors ml-1"
      >
        Скинути
      </button>
    </div>
  );
}
