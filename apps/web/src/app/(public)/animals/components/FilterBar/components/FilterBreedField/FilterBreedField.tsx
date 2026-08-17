"use client";
import { useSpeciesQuery } from "@/shared/query-hooks";
import { useMemo } from "react";
import { useCatalogFilterState } from "../../../../hooks/useCatalogFilterState";
import { FilterDropdown } from "../FilterDropdown";

export function FilterBreedField() {
  const [filters, setFilters] = useCatalogFilterState();
  const { data: species = [] } = useSpeciesQuery();

  const options = useMemo(() => {
    if (filters.type) {
      const activeSpecies = species.find((s) => s.value === filters.type);
      const breeds = activeSpecies?.breeds ?? [];
      return breeds.map((b) => ({ value: b.name, label: b.name }));
    }

    const allBreeds = species.flatMap((s) => s.breeds ?? []);
    const uniqueBreedNames = Array.from(new Set(allBreeds.map((b) => b.name)));
    return uniqueBreedNames.map((name) => ({ value: name, label: name }));
  }, [filters.type, species]);

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
