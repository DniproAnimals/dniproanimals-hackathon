"use client";
import { apiClient } from "@/shared/api-client";
import type { OmitMutationOptions } from "@/shared/types/react-query";
import { useMutation } from "@tanstack/react-query";

export const useUpdateOwnOrganizationMutation = (
  options: OmitMutationOptions<
    typeof apiClient.organizations.updateOwn,
    "mutationFn"
  > = {},
) => {
  return useMutation({
    mutationFn: apiClient.organizations.updateOwn,
    ...options,
  });
};
