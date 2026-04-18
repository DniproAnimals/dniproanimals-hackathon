"use client";
import { apiClient } from "@/shared/api-client";
import type { OmitQueryOptions } from "@/shared/types/react-query";
import { endpoints } from "@dniproanimals/endpoints";
import { useQuery } from "@tanstack/react-query";

export const useAdoptionStatsQuery = (
  options: OmitQueryOptions<
    typeof apiClient.adoption.stats,
    "queryKey" | "queryFn"
  > = {},
) => {
  return useQuery({
    queryKey: [endpoints.adoption.stats()],
    queryFn: () => apiClient.adoption.stats(),
    ...options,
  });
};
