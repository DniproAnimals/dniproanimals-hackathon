"use client";
import { apiClient } from "@/shared/api-client";
import type { OmitMutationOptions } from "@/shared/types/react-query";
import type { StartAnimalDonationBody } from "@dniproanimals/contracts";
import { useMutation } from "@tanstack/react-query";

type StartAnimalDonationVariables = {
  animalId: number;
  body: StartAnimalDonationBody;
};

export const useStartAnimalDonationMutation = (
  options: OmitMutationOptions<
    (
      variables: StartAnimalDonationVariables,
    ) => ReturnType<typeof apiClient.animalDonations.start>,
    "mutationFn"
  > = {},
) => {
  return useMutation({
    mutationFn: ({ animalId, body }: StartAnimalDonationVariables) =>
      apiClient.animalDonations.start(animalId, body),
    ...options,
  });
};
