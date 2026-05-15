"use client";
import { apiClient } from "@/shared/api-client";
import type { OmitMutationOptions } from "@/shared/types/react-query";
import { useMutation } from "@tanstack/react-query";

export const useGoogleLoginMutation = (
  options: OmitMutationOptions<
    typeof apiClient.auth.googleLogin,
    "mutationFn"
  > = {},
) => {
  return useMutation({
    mutationFn: apiClient.auth.googleLogin,
    ...options,
  });
};
