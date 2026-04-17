"use client";
import { apiClient, queryKeys } from "@/shared/query-client";
import type { UpdateAnimalBody } from "@dniproanimals/contracts";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateAnimalMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: UpdateAnimalBody }) =>
      apiClient.animals.update(id, body),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.animals.all });
      qc.invalidateQueries({ queryKey: queryKeys.animals.detail(id) });
    },
  });
}
