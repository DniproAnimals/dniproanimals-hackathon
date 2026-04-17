"use client";
import { apiClient, queryKeys } from "@/shared/query-client";
import { useQuery } from "@tanstack/react-query";

export function useOrganizationQuery(id: number | null | undefined) {
  return useQuery({
    queryKey: id
      ? queryKeys.organizations.detail(id)
      : ["organizations", "none"],
    queryFn: () => apiClient.organizations.get(id as number),
    enabled: !!id,
  });
}
