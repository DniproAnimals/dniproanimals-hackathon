"use client";
import { apiClient } from "@/shared/api-client";
import type { OmitMutationOptions } from "@/shared/types/react-query";
import { useMutation } from "@tanstack/react-query";

export const useCreateVolunteerMutation = (
  options: OmitMutationOptions<
    typeof apiClient.volunteers.create,
    "mutationFn"
  > = {},
) => {
  return useMutation({
    mutationFn: apiClient.volunteers.create,
    ...options,
  });
};
