"use client";
import { apiClient } from "@/shared/api-client";
import type { OmitMutationOptions } from "@/shared/types/react-query";
import { useMutation } from "@tanstack/react-query";

export const useVerifyEmailMutation = (
  options: OmitMutationOptions<
    typeof apiClient.auth.verifyEmail,
    "mutationFn"
  > = {},
) =>
  useMutation({
    mutationFn: apiClient.auth.verifyEmail,
    ...options,
  });
