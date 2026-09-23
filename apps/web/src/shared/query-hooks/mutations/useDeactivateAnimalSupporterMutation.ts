"use client";

import { apiClient } from "@/shared/api-client";
import type { OmitMutationOptions } from "@/shared/types/react-query";
import { useMutation } from "@tanstack/react-query";

type DeactivateAnimalSupporterVariables = {
  animalId: number;
  userId: number;
};

export const useDeactivateAnimalSupporterMutation = (
  options: OmitMutationOptions<
    (
      variables: DeactivateAnimalSupporterVariables,
    ) => ReturnType<typeof apiClient.animalDonations.deactivateSupporter>,
    "mutationFn"
  > = {},
) => {
  return useMutation({
    mutationFn: ({ animalId, userId }: DeactivateAnimalSupporterVariables) =>
      apiClient.animalDonations.deactivateSupporter(animalId, userId),
    ...options,
  });
};
