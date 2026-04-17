"use client";
import { apiClient, queryKeys } from "@/shared/query-client";
import { useQuery } from "@tanstack/react-query";

export function useOrganizationsQuery() {
  return useQuery({
    queryKey: queryKeys.organizations.list(),
    queryFn: () => apiClient.organizations.list(),
  });
}
