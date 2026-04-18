"use client";
import { apiClient } from "@/shared/api-client";
import type { OmitMutationOptions } from "@/shared/types/react-query";
import { useMutation } from "@tanstack/react-query";

export const useRegisterMutation = (
  options: OmitMutationOptions<
    typeof apiClient.auth.register,
    "mutationFn"
  > = {},
) => {
  return useMutation({
    mutationFn: apiClient.auth.register,
    ...options,
  });
};
