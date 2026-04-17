"use client";
import { apiClient, queryKeys } from "@/shared/query-client";
import type { ListLostQuery } from "@dniproanimals/contracts";
import { useQuery } from "@tanstack/react-query";

export function useLostQuery(query?: ListLostQuery) {
  return useQuery({
    queryKey: queryKeys.lost.list(query),
    queryFn: () => apiClient.lost.list(query),
  });
}
