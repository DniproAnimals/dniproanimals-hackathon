"use client";
import { apiClient, queryKeys } from "@/shared/query-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateAdoptionStatusMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: apiClient.adoption.updateStatus,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.adoption.all });
      qc.invalidateQueries({ queryKey: queryKeys.animals.all });
    },
  });
}
