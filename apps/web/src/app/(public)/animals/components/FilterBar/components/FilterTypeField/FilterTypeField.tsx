"use client";
import { useCatalogFilterState } from "../../../../hooks/useCatalogFilterState";
import { FilterDropdown } from "../FilterDropdown";

const OPTIONS = [
  { value: "dog", label: "🐕 Собаки" },
  { value: "cat", label: "🐈 Коти" },
  { value: "other", label: "🐾 Інше" },
];

export function FilterTypeField() {
  const [filters, setFilters] = useCatalogFilterState();
  return (
    <FilterDropdown
      label="Категорія"
      icon="🐾"
      values={filters.type ? [filters.type] : []}
      options={OPTIONS}
      onToggle={(v) =>
        setFilters({
          type:
            filters.type === v ? null : (v as NonNullable<typeof filters.type>),
        })
      }
    />
  );
}
