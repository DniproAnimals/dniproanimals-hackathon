"use client";
import { useCatalogFilterState } from "../../../../hooks/useCatalogFilterState";
import { FilterDropdown } from "../FilterDropdown";

const OPTIONS = [
  { value: "vaccinated", label: "💉 Вакциновано" },
  { value: "sterilized", label: "✂️ Стерилізовано" },
  { value: "trained", label: "🎓 Навчено" },
];

type ExtraKey = "vaccinated" | "sterilized" | "trained";

export function FilterExtraField() {
  const [filters, setFilters] = useCatalogFilterState();

  const values: ExtraKey[] = [
    ...(filters.vaccinated ? (["vaccinated"] as const) : []),
    ...(filters.sterilized ? (["sterilized"] as const) : []),
    ...(filters.trained ? (["trained"] as const) : []),
  ];

  return (
    <FilterDropdown
      label="Додатково"
      icon="⚙️"
      values={values}
      options={OPTIONS}
      onToggle={(v) => {
        const key = v as ExtraKey;
        setFilters({ [key]: !filters[key] ? true : null });
      }}
    />
  );
}
