"use client";
import { apiClient } from "@/shared/api-client";
import type { OmitQueryOptions } from "@/shared/types/react-query";
import { endpoints } from "@dniproanimals/endpoints";
import { useQuery } from "@tanstack/react-query";

export const useOrganizationQuery = (
  id: number,
  options: OmitQueryOptions<
    typeof apiClient.organizations.get,
    "queryKey" | "queryFn"
  > = {},
) => {
  return useQuery({
    queryKey: [endpoints.organizations.get({ id })],
    queryFn: () => apiClient.organizations.get(id),
    ...options,
  });
};
