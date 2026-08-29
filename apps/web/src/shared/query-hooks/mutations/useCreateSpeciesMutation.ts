"use client";
import { apiClient } from "@/shared/api-client";
import type { OmitMutationOptions } from "@/shared/types/react-query";
import { endpoints } from "@dniproanimals/endpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateSpeciesMutation = (
  options: OmitMutationOptions<
    typeof apiClient.animals.createSpecies,
    "mutationFn"
  > = {},
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: apiClient.animals.createSpecies,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: [endpoints.animals.listSpecies()],
      });
      options.onSuccess?.(...args);
    },
    ...options,
  });
};
