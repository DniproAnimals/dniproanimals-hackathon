"use client";
import { apiClient } from "@/shared/api-client";
import type { OmitQueryOptions } from "@/shared/types/react-query";
import { endpoints } from "@dniproanimals/endpoints";
import { useQuery } from "@tanstack/react-query";

export const useOrganizationVolunteersQuery = (
  id: number,
  options: OmitQueryOptions<
    typeof apiClient.organizations.volunteers,
    "queryKey" | "queryFn"
  > = {},
) => {
  return useQuery({
    queryKey: [endpoints.organizations.volunteers({ id })],
    queryFn: () => apiClient.organizations.volunteers(id),
    ...options,
  });
};
