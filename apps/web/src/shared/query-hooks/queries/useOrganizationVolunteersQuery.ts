"use client";
import { apiClient, queryKeys } from "@/shared/query-client";
import { useQuery } from "@tanstack/react-query";

export function useOrganizationVolunteersQuery(id: number | null | undefined) {
  return useQuery({
    queryKey: id
      ? queryKeys.organizations.volunteers(id)
      : ["org-volunteers", "none"],
    queryFn: () => apiClient.organizations.volunteers(id as number),
    enabled: !!id,
  });
}
