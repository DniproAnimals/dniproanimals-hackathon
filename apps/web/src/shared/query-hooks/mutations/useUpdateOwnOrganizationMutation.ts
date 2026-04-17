"use client";
import { apiClient, queryKeys } from "@/shared/query-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateOwnOrganizationMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: apiClient.organizations.updateOwn,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.organizations.all }),
  });
}
