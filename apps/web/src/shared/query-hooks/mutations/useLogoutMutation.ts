"use client";
import { apiClient, queryKeys } from "@/shared/query-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UseLogoutMutationOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useLogoutMutation(options?: UseLogoutMutationOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiClient.auth.logout,
    onSuccess: async () => {
      queryClient.setQueryData(queryKeys.auth.me, null);
      await queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
      await options?.onSuccess?.();
    },
    onError: options?.onError,
  });
}
