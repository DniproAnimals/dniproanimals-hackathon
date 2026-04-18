"use client";
import { SearchField } from "@/shared/components/SearchField";
import { useRequestsFilterState } from "../../../../hooks/useRequestsFilterState";

export function RequestsSearchField() {
  const [filters, setFilters] = useRequestsFilterState();
  return (
    <SearchField
      value={filters.q ?? ""}
      onChange={(v) => setFilters({ q: v })}
      inputClassName="bg-white w-72"
    />
  );
}
