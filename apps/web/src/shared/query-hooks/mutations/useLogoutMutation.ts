"use client";
import { apiClient } from "@/shared/api-client";
import type { OmitMutationOptions } from "@/shared/types/react-query";
import { endpoints } from "@dniproanimals/endpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useLogoutMutation = (
  options: OmitMutationOptions<typeof apiClient.auth.logout, "mutationFn"> = {},
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiClient.auth.logout(),
    ...options,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({
        queryKey: [endpoints.auth.me()],
      });
      // Invalidate everything else too just in case
      queryClient.clear();
      options.onSuccess?.(...args);
    },
  });
};
