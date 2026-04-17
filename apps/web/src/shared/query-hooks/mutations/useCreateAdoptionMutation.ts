"use client";
import { apiClient, queryKeys } from "@/shared/query-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateAdoptionMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: apiClient.adoption.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.adoption.all }),
  });
}
