"use client";
import { IconX } from "@dniproanimals/icons";
import { FilterChip } from "@dniproanimals/ui";
import { useCatalogFilterState } from "../../../../hooks/useCatalogFilterState";

const TYPE_LABELS: Record<string, string> = {
  dog: "Собаки",
  cat: "Коти",
  other: "Інше",
};
const SEX_LABELS: Record<string, string> = {
  male: "Хлопчик",
  female: "Дівчинка",
};
const SIZE_LABELS: Record<string, string> = {
  small: "Малий",
  medium: "Середній",
  large: "Великий",
};
const EXTRA_LABELS = {
  vaccinated: "Вакциновано",
  sterilized: "Стерилізовано",
  trained: "Навчено",
} as const;

export function FilterActiveChips() {
  const [filters, setFilters] = useCatalogFilterState();

  const chips: { key: string; label: string; clear: () => void }[] = [];

  if (filters.type) {
    chips.push({
      key: `type-${filters.type}`,
      label: TYPE_LABELS[filters.type] ?? filters.type,
      clear: () => setFilters({ type: null }),
    });
  }
  if (filters.sex) {
    chips.push({
      key: `sex-${filters.sex}`,
      label: SEX_LABELS[filters.sex] ?? filters.sex,
      clear: () => setFilters({ sex: null }),
    });
  }
  if (filters.size) {
    chips.push({
      key: `size-${filters.size}`,
      label: SIZE_LABELS[filters.size] ?? filters.size,
      clear: () => setFilters({ size: null }),
    });
  }
  for (const v of filters.breed) {
    chips.push({
      key: `breed-${v}`,
      label: v,
      clear: () =>
        setFilters({
          breed: filters.breed.filter((b) => b !== v).length
            ? filters.breed.filter((b) => b !== v)
            : null,
        }),
    });
  }
  for (const v of filters.color) {
    chips.push({
      key: `color-${v}`,
      label: v,
      clear: () =>
        setFilters({
          color: filters.color.filter((c) => c !== v).length
            ? filters.color.filter((c) => c !== v)
            : null,
        }),
    });
  }
  for (const k of ["vaccinated", "sterilized", "trained"] as const) {
    if (filters[k]) {
      chips.push({
        key: `extra-${k}`,
        label: EXTRA_LABELS[k],
        clear: () => setFilters({ [k]: null }),
      });
    }
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1 pt-1">
      {chips.map((chip) => (
        <FilterChip key={chip.key} size="sm" onClick={chip.clear}>
          {chip.label}
          <IconX className="size-2.5 text-gray-medium" strokeWidth={3} />
        </FilterChip>
      ))}
    </div>
  );
}
