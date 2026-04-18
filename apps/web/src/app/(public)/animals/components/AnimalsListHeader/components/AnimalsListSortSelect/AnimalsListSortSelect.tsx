"use client";
import { ListAnimalsSort } from "@dniproanimals/contracts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@dniproanimals/ui";
import { useCatalogFilterState } from "../../../../hooks/useCatalogFilterState";

const SORT_OPTIONS = [
  { value: "newest", label: "Нові спочатку" },
  { value: "oldest", label: "Старі спочатку" },
  { value: "name_asc", label: "А → Я" },
  { value: "name_desc", label: "Я → А" },
  { value: "age_asc", label: "Наймолодші" },
  { value: "age_desc", label: "Найстарші" },
  { value: "weight_asc", label: "Легкі спочатку" },
  { value: "weight_desc", label: "Важкі спочатку" },
] as const;

export function AnimalsListSortSelect() {
  const [filters, setFilters] = useCatalogFilterState();

  return (
    <div className="flex items-center gap-1.5">
      <Select
        value={filters.sort}
        onValueChange={(v) =>
          setFilters({
            sort: v as ListAnimalsSort,
          })
        }
      >
        <SelectTrigger className="w-50">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
