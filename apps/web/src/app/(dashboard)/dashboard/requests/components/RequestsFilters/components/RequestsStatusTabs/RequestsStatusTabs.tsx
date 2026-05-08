"use client";
import { ADOPTION_STATUS_LABEL } from "@/shared/constants";
import { useAdoptionStatsQuery } from "@/shared/query-hooks";
import { adoptionStatusSchema } from "@dniproanimals/contracts";
import { FilterChip } from "@dniproanimals/ui";
import { useRequestsFilterState } from "../../../../hooks/useRequestsFilterState";

const STATUS_TABS = ["all", ...adoptionStatusSchema.options] as const;
type StatusTab = (typeof STATUS_TABS)[number];

export function RequestsStatusTabs() {
  const [filters, setFilters] = useRequestsFilterState();
  const { data: stats } = useAdoptionStatsQuery();

  const countFor = (s: StatusTab) =>
    s === "all" ? (stats?.total ?? 0) : (stats?.[s] ?? 0);

  return (
    <div className="flex gap-1">
      {STATUS_TABS.map((s) => (
        <FilterChip
          key={s}
          variant={(filters.status ?? "all") === s ? "active" : "outline"}
          size="md"
          onClick={() => setFilters({ status: s === "all" ? null : s })}
          count={countFor(s)}
        >
          {s === "all" ? "Усі" : ADOPTION_STATUS_LABEL[s]}
        </FilterChip>
      ))}
    </div>
  );
}
