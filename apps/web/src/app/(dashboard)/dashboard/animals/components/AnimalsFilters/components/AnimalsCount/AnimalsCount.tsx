"use client";
import { useAnimalsQuery } from "@/shared/query-hooks";
import { useAnimalsFilterState } from "../../../../hooks/useAnimalsFilterState";

export function AnimalsCount() {
  const [params] = useAnimalsFilterState();
  const { data: animals = [] } = useAnimalsQuery({
    q: params.q ?? undefined,
    type: params.type ?? undefined,
    status: params.status ?? undefined,
  });
  return (
    <span className="text-xs text-gray-medium">{animals.length} тварин</span>
  );
}
