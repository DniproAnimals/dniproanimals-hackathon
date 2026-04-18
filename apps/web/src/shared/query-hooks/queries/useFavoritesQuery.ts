"use client";
import { apiClient } from "@/shared/api-client";
import type { OmitQueryOptions } from "@/shared/types/react-query";
import { endpoints } from "@dniproanimals/endpoints";
import { useQuery } from "@tanstack/react-query";

export const useFavoritesQuery = (
  options: OmitQueryOptions<
    typeof apiClient.favorites.list,
    "queryKey" | "queryFn"
  > = {},
) => {
  return useQuery({
    queryKey: [endpoints.favorites.list()],
    queryFn: () => apiClient.favorites.list(),
    ...options,
  });
};
