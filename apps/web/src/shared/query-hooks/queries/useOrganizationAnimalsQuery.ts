"use client";
import { apiClient, queryKeys } from "@/shared/query-client";
import { useQuery } from "@tanstack/react-query";

export function useOrganizationAnimalsQuery(id: number | null | undefined) {
  return useQuery({
    queryKey: id
      ? queryKeys.organizations.animals(id)
      : ["org-animals", "none"],
    queryFn: () => apiClient.organizations.animals(id as number),
    enabled: !!id,
  });
}
