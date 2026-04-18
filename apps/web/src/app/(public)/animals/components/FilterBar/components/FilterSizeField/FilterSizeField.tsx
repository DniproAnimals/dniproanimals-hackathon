"use client";
import { useCatalogFilterState } from "../../../../hooks/useCatalogFilterState";
import { FilterDropdown } from "../FilterDropdown";

const OPTIONS = [
  { value: "small", label: "Малий" },
  { value: "medium", label: "Середній" },
  { value: "large", label: "Великий" },
];

export function FilterSizeField() {
  const [filters, setFilters] = useCatalogFilterState();
  return (
    <FilterDropdown
      label="Розмір"
      icon="📏"
      values={filters.size ? [filters.size] : []}
      options={OPTIONS}
      onToggle={(v) =>
        setFilters({
          size:
            filters.size === v ? null : (v as NonNullable<typeof filters.size>),
        })
      }
    />
  );
}
