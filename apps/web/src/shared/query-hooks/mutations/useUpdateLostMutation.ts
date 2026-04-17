"use client";
import { apiClient, queryKeys } from "@/shared/query-client";
import type { UpdateLostBody } from "@dniproanimals/contracts";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateLostMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: UpdateLostBody }) =>
      apiClient.lost.update(id, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.lost.all }),
  });
}
