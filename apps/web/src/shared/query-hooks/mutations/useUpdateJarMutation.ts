"use client";
import { apiClient, queryKeys } from "@/shared/query-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateJarMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: apiClient.organizations.updateJar,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.organizations.all }),
  });
}
