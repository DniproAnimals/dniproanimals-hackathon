"use client";
import { ALL_BREEDS } from "@/shared/constants";
import { useCatalogFilterState } from "../../../../hooks/useCatalogFilterState";
import { FilterDropdown } from "../FilterDropdown";

const OPTIONS = ALL_BREEDS.map((b) => ({ value: b, label: b }));

export function FilterBreedField() {
  const [filters, setFilters] = useCatalogFilterState();
  return (
    <FilterDropdown
      label="Порода"
      icon="🏷️"
      values={filters.breed}
      options={OPTIONS}
      search
      onToggle={(v) => {
        const next = filters.breed.includes(v)
          ? filters.breed.filter((x) => x !== v)
          : [...filters.breed, v];
        setFilters({ breed: next.length ? next : null });
      }}
    />
  );
}
