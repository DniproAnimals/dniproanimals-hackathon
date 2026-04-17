"use client";
import { apiClient, queryKeys } from "@/shared/query-client";
import { useQuery } from "@tanstack/react-query";

export function useFavoritesQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.favorites.list,
    queryFn: () => apiClient.favorites.list(),
    enabled,
  });
}
