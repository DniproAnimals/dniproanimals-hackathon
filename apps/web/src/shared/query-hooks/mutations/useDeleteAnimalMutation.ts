"use client";
import { apiClient, queryKeys } from "@/shared/query-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteAnimalMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => apiClient.animals.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.animals.all }),
  });
}
