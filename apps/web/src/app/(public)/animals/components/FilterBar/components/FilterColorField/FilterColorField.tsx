"use client";

import { ANIMAL_COLORS, OTHER_ANIMAL_COLOR_VALUE } from "@/shared/constants";
import { useCatalogFilterState } from "../../../../hooks/useCatalogFilterState";
import { FilterDropdown } from "../FilterDropdown";

const OPTIONS = [
  ...ANIMAL_COLORS.map((color) => ({
    value: color.value,
    label: color.value,
    color: color.hex,
  })),
  {
    value: OTHER_ANIMAL_COLOR_VALUE,
    label: "Інший",
  },
];

export function FilterColorField() {
  const [filters, setFilters] = useCatalogFilterState();

  return (
    <FilterDropdown
      label="Колір"
      icon="🎨"
      values={filters.color}
      options={OPTIONS}
      colorCircles
      onToggle={(value) => {
        const next = filters.color.includes(value)
          ? filters.color.filter((color) => color !== value)
          : [...filters.color, value];

        setFilters({
          color: next.length ? next : null,
        });
      }}
    />
  );
}
