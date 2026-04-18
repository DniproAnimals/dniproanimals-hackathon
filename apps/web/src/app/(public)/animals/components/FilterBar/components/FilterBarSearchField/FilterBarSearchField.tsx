"use client";
import { SearchField } from "@/shared/components/SearchField";
import { useCatalogFilterState } from "../../../../hooks/useCatalogFilterState";

export function FilterBarSearchField() {
  const [filters, setFilters] = useCatalogFilterState();

  return (
    <SearchField
      value={filters.q ?? ""}
      onChange={(q) => setFilters({ q })}
      size="sm"
      inputClassName="bg-white text-xs"
    />
  );
}
