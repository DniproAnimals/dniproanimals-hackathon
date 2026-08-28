"use client";
import { apiClient } from "@/shared/api-client";
import type { OmitMutationOptions } from "@/shared/types/react-query";
import { useMutation } from "@tanstack/react-query";

export const useStartAnimalDonationMutation = (
  options: OmitMutationOptions<
    typeof apiClient.animalDonations.start,
    "mutationFn"
  > = {},
) => {
  return useMutation({
    mutationFn: apiClient.animalDonations.start,
    ...options,
  });
};
