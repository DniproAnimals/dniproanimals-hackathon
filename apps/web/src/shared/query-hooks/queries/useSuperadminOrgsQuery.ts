"use client";
import { apiClient } from "@/shared/api-client";
import type { OmitQueryOptions } from "@/shared/types/react-query";
import { endpoints } from "@dniproanimals/endpoints";
import { useQuery } from "@tanstack/react-query";

export const useSuperadminOrgsQuery = (
  options: OmitQueryOptions<
    typeof apiClient.superadmin.listOrgs,
    "queryKey" | "queryFn"
  > = {},
) => {
  return useQuery({
    queryKey: [endpoints.superadmin.listOrgs()],
    queryFn: () => apiClient.superadmin.listOrgs(),
    ...options,
  });
};
