"use client";
import { apiClient } from "@/shared/api-client";
import type { OmitQueryOptions } from "@/shared/types/react-query";
import { endpoints } from "@dniproanimals/endpoints";
import { useQuery } from "@tanstack/react-query";

export const useOrganizationsQuery = (
  options: OmitQueryOptions<
    typeof apiClient.organizations.list,
    "queryKey" | "queryFn"
  > = {},
) => {
  return useQuery({
    queryKey: [endpoints.organizations.list()],
    queryFn: () => apiClient.organizations.list(),
    ...options,
  });
};
