"use client";
import { apiClient } from "@/shared/api-client";
import type { OmitMutationOptions } from "@/shared/types/react-query";
import { useMutation } from "@tanstack/react-query";

export const useUpdateJarMutation = (
  options: OmitMutationOptions<
    typeof apiClient.organizations.updateJar,
    "mutationFn"
  > = {},
) => {
  return useMutation({
    mutationFn: apiClient.organizations.updateJar,
    ...options,
  });
};
