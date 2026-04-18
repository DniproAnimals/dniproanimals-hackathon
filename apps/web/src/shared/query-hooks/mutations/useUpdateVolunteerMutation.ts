"use client";
import { apiClient } from "@/shared/api-client";
import type { OmitMutationOptions } from "@/shared/types/react-query";
import { useMutation } from "@tanstack/react-query";

export const useUpdateVolunteerMutation = (
  options: OmitMutationOptions<
    typeof apiClient.volunteers.update,
    "mutationFn"
  > = {},
) => {
  return useMutation({
    mutationFn: apiClient.volunteers.update,
    ...options,
  });
};
