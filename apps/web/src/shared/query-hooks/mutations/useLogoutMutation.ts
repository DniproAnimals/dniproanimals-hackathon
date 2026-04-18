"use client";
import { apiClient } from "@/shared/api-client";
import type { OmitMutationOptions } from "@/shared/types/react-query";
import { useMutation } from "@tanstack/react-query";

export const useLogoutMutation = (
  options: OmitMutationOptions<
    typeof apiClient.auth.logout,
    "mutationFn"
  > = {},
) => {
  return useMutation({
    mutationFn: apiClient.auth.logout,
    ...options,
  });
};
