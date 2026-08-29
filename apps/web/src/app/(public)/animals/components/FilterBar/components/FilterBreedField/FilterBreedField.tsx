"use client";
import { useBreedsQuery } from "@/shared/query-hooks";
import { useMemo } from "react";
import { useCatalogFilterState } from "../../../../hooks/useCatalogFilterState";
import { FilterDropdown } from "../FilterDropdown";

export function FilterBreedField() {
  const [filters, setFilters] = useCatalogFilterState();
  const { data: breeds = [] } = useBreedsQuery(
    filters.type ? { type: filters.type } : undefined,
  );

  const options = useMemo(
    () => breeds.map((b) => ({ value: b.name, label: b.name })),
    [breeds],
  );

  return (
    <FilterDropdown
      label="Порода"
      icon="🏷️"
      values={filters.breed}
      options={options}
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
