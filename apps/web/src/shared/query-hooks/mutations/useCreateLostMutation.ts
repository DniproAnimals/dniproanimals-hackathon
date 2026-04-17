"use client";
import { apiClient, queryKeys } from "@/shared/query-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateLostMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: apiClient.lost.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.lost.all }),
  });
}
