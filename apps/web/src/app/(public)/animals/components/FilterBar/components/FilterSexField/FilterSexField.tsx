"use client";
import { useCatalogFilterState } from "../../../../hooks/useCatalogFilterState";
import { FilterDropdown } from "../FilterDropdown";

const OPTIONS = [
  { value: "male", label: "♂️ Хлопчик" },
  { value: "female", label: "♀️ Дівчинка" },
];

export function FilterSexField() {
  const [filters, setFilters] = useCatalogFilterState();
  return (
    <FilterDropdown
      label="Стать"
      icon="⚤"
      values={filters.sex ? [filters.sex] : []}
      options={OPTIONS}
      onToggle={(v) =>
        setFilters({
          sex:
            filters.sex === v ? null : (v as NonNullable<typeof filters.sex>),
        })
      }
    />
  );
}
