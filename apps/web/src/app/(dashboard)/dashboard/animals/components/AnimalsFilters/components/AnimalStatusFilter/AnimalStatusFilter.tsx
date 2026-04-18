"use client";
import { ANIMAL_STATUS_LABEL } from "@/shared/constants";
import {
  animalStatusSchema,
  type AnimalStatus,
} from "@dniproanimals/contracts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@dniproanimals/ui";
import { useAnimalsFilterState } from "../../../../hooks/useAnimalsFilterState";

export function AnimalStatusFilter() {
  const [filters, setFilters] = useAnimalsFilterState();
  return (
    <Select
      value={filters.status ?? "all"}
      onValueChange={(v) =>
        setFilters({ status: v === "all" ? null : (v as AnimalStatus) })
      }
    >
      <SelectTrigger className="bg-white w-auto">
        <SelectValue placeholder="Усі статуси" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Усі статуси</SelectItem>
        {animalStatusSchema.options.map((s) => (
          <SelectItem key={s} value={s}>
            {ANIMAL_STATUS_LABEL[s]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
