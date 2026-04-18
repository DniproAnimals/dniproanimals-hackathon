"use client";
import { apiClient } from "@/shared/api-client";
import type { OmitQueryOptions } from "@/shared/types/react-query";
import { endpoints } from "@dniproanimals/endpoints";
import { useQuery } from "@tanstack/react-query";

export const useVolunteersStatsQuery = (
  options: OmitQueryOptions<
    typeof apiClient.volunteers.stats,
    "queryKey" | "queryFn"
  > = {},
) => {
  return useQuery({
    queryKey: [endpoints.volunteers.stats()],
    queryFn: () => apiClient.volunteers.stats(),
    ...options,
  });
};
