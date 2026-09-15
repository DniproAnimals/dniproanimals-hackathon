"use client";
import { useSpeciesQuery } from "@/shared/query-hooks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@dniproanimals/ui";
import { useAnimalsFilterState } from "../../../../hooks/useAnimalsFilterState";

const ANIMAL_TYPE_FILTER_LABEL: Record<string, string> = {
  dog: "Собаки",
  cat: "Коти",
  other: "Інше",
};

export function AnimalTypeFilter() {
  const [filters, setFilters] = useAnimalsFilterState();
  const { data: species = [] } = useSpeciesQuery();

  return (
    <Select
      value={filters.type ?? "all"}
      onValueChange={(v) => setFilters({ type: v === "all" ? null : v })}
    >
      <SelectTrigger className="bg-white w-auto min-w-[120px]">
        <SelectValue placeholder="Усі види" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Усі види</SelectItem>
        {species.map((s) => {
          const label = ANIMAL_TYPE_FILTER_LABEL[s.value] ?? s.name;
          return (
            <SelectItem key={s.value} value={s.value}>
              {label}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
