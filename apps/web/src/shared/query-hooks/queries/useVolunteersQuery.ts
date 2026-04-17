"use client";
import { apiClient, queryKeys } from "@/shared/query-client";
import { useQuery } from "@tanstack/react-query";

export function useVolunteersQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.volunteers.list,
    queryFn: () => apiClient.volunteers.list(),
    enabled,
  });
}
