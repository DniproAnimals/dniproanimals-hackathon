"use client";
import { apiClient } from "@/shared/api-client";
import type { OmitQueryOptions } from "@/shared/types/react-query";
import { endpoints } from "@dniproanimals/endpoints";
import { useQuery } from "@tanstack/react-query";

export const useSuperadminOrgsStatsQuery = (
  options: OmitQueryOptions<
    typeof apiClient.superadmin.orgsStats,
    "queryKey" | "queryFn"
  > = {},
) => {
  return useQuery({
    queryKey: [endpoints.superadmin.orgsStats()],
    queryFn: () => apiClient.superadmin.orgsStats(),
    ...options,
  });
};
