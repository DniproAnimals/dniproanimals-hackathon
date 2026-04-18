"use client";
import { apiClient } from "@/shared/api-client";
import type { OmitMutationOptions } from "@/shared/types/react-query";
import { useMutation } from "@tanstack/react-query";

export const useCreateOrganizationMutation = (
  options: OmitMutationOptions<
    typeof apiClient.organizations.create,
    "mutationFn"
  > = {},
) => {
  return useMutation({
    mutationFn: apiClient.organizations.create,
    ...options,
  });
};
