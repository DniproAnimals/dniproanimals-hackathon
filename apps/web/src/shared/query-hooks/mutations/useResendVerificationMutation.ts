"use client";
import { apiClient } from "@/shared/api-client";
import type {
  ResendEmailBody,
  ResendEmailResponse,
} from "@dniproanimals/contracts";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

export const useResendVerificationMutation = (
  options: Omit<
    UseMutationOptions<ResendEmailResponse, Error, ResendEmailBody>,
    "mutationFn"
  > = {},
) => {
  return useMutation({
    mutationFn: (body: ResendEmailBody) =>
      apiClient.auth.resendVerification(body),
    ...options,
  });
};
