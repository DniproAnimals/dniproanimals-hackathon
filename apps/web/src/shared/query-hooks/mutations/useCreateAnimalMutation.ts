"use client";
import { apiClient, queryKeys } from "@/shared/query-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateAnimalMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: apiClient.animals.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.animals.all }),
  });
}
