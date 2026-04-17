"use client";
import { apiClient, queryKeys } from "@/shared/query-client";
import { useQuery } from "@tanstack/react-query";

export function useMeQuery() {
  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: () => apiClient.auth.me(),
    retry: false,
  });
}
