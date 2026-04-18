"use client";
import { apiClient } from "@/shared/api-client";
import type { OmitQueryOptions } from "@/shared/types/react-query";
import { endpoints } from "@dniproanimals/endpoints";
import { useQuery } from "@tanstack/react-query";

export const useOrganizationAnimalsQuery = (
  id: number,
  options: OmitQueryOptions<
    typeof apiClient.organizations.animals,
    "queryKey" | "queryFn"
  > = {},
) => {
  return useQuery({
    queryKey: [endpoints.organizations.animals({ id })],
    queryFn: () => apiClient.organizations.animals(id),
    ...options,
  });
};
