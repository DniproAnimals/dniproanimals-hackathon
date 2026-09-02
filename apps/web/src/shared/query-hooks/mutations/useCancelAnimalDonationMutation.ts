"use client";
import { apiClient } from "@/shared/api-client";
import type { OmitMutationOptions } from "@/shared/types/react-query";
import { useMutation } from "@tanstack/react-query";

export const useCancelAnimalDonationMutation = (
  options: OmitMutationOptions<
    typeof apiClient.animalDonations.cancel,
    "mutationFn"
  > = {},
) => {
  return useMutation({
    mutationFn: apiClient.animalDonations.cancel,
    ...options,
  });
};
