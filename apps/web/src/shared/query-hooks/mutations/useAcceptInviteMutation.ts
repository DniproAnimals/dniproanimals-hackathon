"use client";
import { apiClient, queryKeys } from "@/shared/query-client";
import type { User } from "@dniproanimals/contracts";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface Options {
  onSuccess?: (user: User) => void;
  onError?: (error: Error) => void;
}

export function useAcceptInviteMutation(options?: Options) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: apiClient.volunteers.acceptInvite,
    onSuccess: async (user) => {
      qc.setQueryData(queryKeys.auth.me, user);
      await options?.onSuccess?.(user);
    },
    onError: options?.onError,
  });
}
