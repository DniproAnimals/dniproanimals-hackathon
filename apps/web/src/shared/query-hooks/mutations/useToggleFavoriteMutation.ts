"use client";

import { apiClient } from "@/shared/api-client";
import type { OmitMutationOptions } from "@/shared/types/react-query";
import { endpoints } from "@dniproanimals/endpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useToggleFavoriteMutation = (
  options: OmitMutationOptions<
    typeof apiClient.favorites.toggle,
    "mutationFn"
  > = {},
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiClient.favorites.toggle,

    ...options,

    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({
        queryKey: [endpoints.favorites.list()],
      });

      await options.onSuccess?.(...args);
    },
  });
};
