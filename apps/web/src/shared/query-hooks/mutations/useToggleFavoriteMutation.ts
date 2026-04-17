"use client";
import { apiClient, queryKeys } from "@/shared/query-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useToggleFavoriteMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: apiClient.favorites.toggle,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.favorites.list }),
  });
}
