"use client";
import { apiClient, queryKeys } from "@/shared/query-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useSuperadminUpdateOrgMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: apiClient.superadmin.updateOrg,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.organizations.all }),
  });
}
