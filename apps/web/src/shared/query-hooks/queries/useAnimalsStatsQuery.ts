"use client";
import { apiClient } from "@/shared/api-client";
import type { OmitQueryOptions } from "@/shared/types/react-query";
import { endpoints } from "@dniproanimals/endpoints";
import { useQuery } from "@tanstack/react-query";

export const useAnimalsStatsQuery = (
  options: OmitQueryOptions<
    typeof apiClient.animals.stats,
    "queryKey" | "queryFn"
  > = {},
) => {
  return useQuery({
    queryKey: [endpoints.animals.stats()],
    queryFn: () => apiClient.animals.stats(),
    ...options,
  });
};
