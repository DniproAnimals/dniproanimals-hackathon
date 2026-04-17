"use client";
import { apiClient, queryKeys } from "@/shared/query-client";
import type { ListAdoptionQuery } from "@dniproanimals/contracts";
import { useQuery } from "@tanstack/react-query";

export function useAdoptionQuery(query?: ListAdoptionQuery) {
  return useQuery({
    queryKey: queryKeys.adoption.list(query),
    queryFn: () => apiClient.adoption.list(query),
  });
}
