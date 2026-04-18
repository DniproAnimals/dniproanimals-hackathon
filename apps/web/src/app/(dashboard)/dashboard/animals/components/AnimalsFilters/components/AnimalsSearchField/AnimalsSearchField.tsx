"use client";
import { SearchField } from "@/shared/components/SearchField";
import { useAnimalsFilterState } from "../../../../hooks/useAnimalsFilterState";

export function AnimalsSearchField() {
  const [filters, setFilters] = useAnimalsFilterState();
  return (
    <SearchField
      value={filters.q ?? ""}
      onChange={(v) => setFilters({ q: v })}
      inputClassName="bg-white w-56"
    />
  );
}
