"use client";
import { animalTypeSchema, type AnimalType } from "@dniproanimals/contracts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@dniproanimals/ui";
import { useAnimalsFilterState } from "../../../../hooks/useAnimalsFilterState";

const ANIMAL_TYPE_FILTER_LABEL: Record<AnimalType, string> = {
  dog: "Собаки",
  cat: "Коти",
  other: "Інше",
};

export function AnimalTypeFilter() {
  const [filters, setFilters] = useAnimalsFilterState();
  return (
    <Select
      value={filters.type ?? "all"}
      onValueChange={(v) =>
        setFilters({ type: v === "all" ? null : (v as AnimalType) })
      }
    >
      <SelectTrigger className="bg-white w-auto">
        <SelectValue placeholder="Усі види" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Усі види</SelectItem>
        {animalTypeSchema.options.map((t) => (
          <SelectItem key={t} value={t}>
            {ANIMAL_TYPE_FILTER_LABEL[t]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
