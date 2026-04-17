"use client";
import { apiClient, queryKeys } from "@/shared/query-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateOrgStatusMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: apiClient.organizations.updateStatus,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.organizations.all }),
  });
}
