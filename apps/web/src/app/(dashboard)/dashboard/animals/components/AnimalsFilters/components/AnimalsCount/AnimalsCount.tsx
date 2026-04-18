"use client";
import { useAnimalsQuery, useCurrentOrg } from "@/shared/query-hooks";
import { useAnimalsFilterState } from "../../../../hooks/useAnimalsFilterState";

export function AnimalsCount() {
  const { org } = useCurrentOrg();
  const [filters] = useAnimalsFilterState();
  const { data: animals = [] } = useAnimalsQuery(
    {
      orgId: org?.id,
      type: filters.type ?? undefined,
      status: filters.status ?? undefined,
      q: filters.q ?? undefined,
    },
    { enabled: !!org?.id },
  );
  return (
    <span className="text-xs text-gray-medium">{animals.length} тварин</span>
  );
}
