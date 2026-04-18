"use client";
import { apiClient } from "@/shared/api-client";
import type { OmitMutationOptions } from "@/shared/types/react-query";
import { useMutation } from "@tanstack/react-query";

export const useAcceptInviteMutation = (
  options: OmitMutationOptions<
    typeof apiClient.volunteers.acceptInvite,
    "mutationFn"
  > = {},
) => {
  return useMutation({
    mutationFn: apiClient.volunteers.acceptInvite,
    ...options,
  });
};
