"use client";
import { ORG_STATUS_LABEL } from "@/shared/constants";
import { useSuperadminOrgsStatsQuery } from "@/shared/query-hooks";
import { orgStatuses } from "@dniproanimals/contracts";
import { FilterChip } from "@dniproanimals/ui";
import { useOrgsFilterState } from "../../../../hooks/useOrgsFilterState";

export function OrgStatusChips() {
  const [params, setParams] = useOrgsFilterState();
  const { data: stats } = useSuperadminOrgsStatsQuery();
  const active = params.status ?? "all";

  return (
    <div className="flex gap-1">
      <FilterChip
        variant={active === "all" ? "active" : "outline"}
        size="md"
        onClick={() => setParams({ status: null })}
        count={stats?.total ?? 0}
      >
        Усі
      </FilterChip>
      {orgStatuses.map((status) => (
        <FilterChip
          key={status}
          variant={active === status ? "active" : "outline"}
          size="md"
          onClick={() => setParams({ status })}
          count={stats?.[status] ?? 0}
        >
          {ORG_STATUS_LABEL[status]}
        </FilterChip>
      ))}
    </div>
  );
}
