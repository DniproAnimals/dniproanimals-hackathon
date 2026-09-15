"use client";
import { ANIMAL_TYPE_EMOJI } from "@/shared/constants";
import { useSpeciesQuery } from "@/shared/query-hooks";
import { useCatalogFilterState } from "../../../../hooks/useCatalogFilterState";
import { FilterDropdown } from "../FilterDropdown";

export function FilterTypeField() {
  const [filters, setFilters] = useCatalogFilterState();
  const { data: species = [] } = useSpeciesQuery();

  const options = species.map((s) => ({
    value: s.value,
    label: `${ANIMAL_TYPE_EMOJI[s.value as keyof typeof ANIMAL_TYPE_EMOJI] ?? "🐾"} ${s.name}`,
  }));

  return (
    <FilterDropdown
      label="Категорія"
      icon="🐾"
      values={filters.type ? [filters.type] : []}
      options={options}
      onToggle={(v) => {
        const next = filters.type === v ? null : v;
        setFilters({
          type: next,
          breed: null,
        });
      }}
    />
  );
}
