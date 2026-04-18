"use client";
import { apiClient } from "@/shared/api-client";
import type { OmitMutationOptions } from "@/shared/types/react-query";
import { useMutation } from "@tanstack/react-query";

export const useLoginMutation = (
  options: OmitMutationOptions<
    typeof apiClient.auth.login,
    "mutationFn"
  > = {},
) => {
  return useMutation({
    mutationFn: apiClient.auth.login,
    ...options,
  });
};
