"use client";
import { ANIMAL_COLORS } from "@/shared/constants";
import { useCatalogFilterState } from "../../../../hooks/useCatalogFilterState";
import { FilterDropdown } from "../FilterDropdown";

const OPTIONS = ANIMAL_COLORS.map((c) => ({
  value: c.value,
  label: c.value,
  color: c.hex,
}));

export function FilterColorField() {
  const [filters, setFilters] = useCatalogFilterState();
  return (
    <FilterDropdown
      label="Колір"
      icon="🎨"
      values={filters.color}
      options={OPTIONS}
      colorCircles
      onToggle={(v) => {
        const next = filters.color.includes(v)
          ? filters.color.filter((x) => x !== v)
          : [...filters.color, v];
        setFilters({ color: next.length ? next : null });
      }}
    />
  );
}
