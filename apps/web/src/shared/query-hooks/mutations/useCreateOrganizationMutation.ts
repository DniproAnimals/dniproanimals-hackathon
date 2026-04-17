"use client";
import { apiClient, queryKeys } from "@/shared/query-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateOrganizationMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: apiClient.organizations.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.organizations.all });
      qc.invalidateQueries({ queryKey: queryKeys.auth.me });
    },
  });
}
