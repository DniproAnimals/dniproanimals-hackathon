"use client";
import { apiClient, queryKeys } from "@/shared/query-client";
import type { User } from "@dniproanimals/contracts";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UseLoginMutationOptions {
  onSuccess?: (user: User) => void;
  onError?: (error: Error) => void;
}

export function useLoginMutation(options?: UseLoginMutationOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiClient.auth.login,
    onSuccess: async (user) => {
      queryClient.setQueryData(queryKeys.auth.me, user);
      await options?.onSuccess?.(user);
    },
    onError: options?.onError,
  });
}
