"use client";
import { apiClient, queryKeys } from "@/shared/query-client";
import type { ListAnimalsQuery } from "@dniproanimals/contracts";
import { useQuery } from "@tanstack/react-query";

export function useAnimalsQuery(query?: ListAnimalsQuery) {
  return useQuery({
    queryKey: queryKeys.animals.list(query),
    queryFn: () => apiClient.animals.list(query),
  });
}
