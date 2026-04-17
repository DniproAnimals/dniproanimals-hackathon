"use client";
import { apiClient, queryKeys } from "@/shared/query-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useSuperadminDeleteOrgMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: apiClient.superadmin.deleteOrg,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.organizations.all }),
  });
}
