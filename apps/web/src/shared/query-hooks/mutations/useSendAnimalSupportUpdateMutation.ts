"use client";
import { apiClient } from "@/shared/api-client";
import type {
  SendAnimalSupportUpdateBody,
  SendAnimalSupportUpdateResponse,
} from "@dniproanimals/contracts";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

interface SendAnimalSupportUpdateArgs {
  animalId: number;
  body: SendAnimalSupportUpdateBody;
}

export const useSendAnimalSupportUpdateMutation = (
  options: Omit<
    UseMutationOptions<
      SendAnimalSupportUpdateResponse,
      Error,
      SendAnimalSupportUpdateArgs
    >,
    "mutationFn"
  > = {},
) => {
  return useMutation({
    mutationFn: ({ animalId, body }: SendAnimalSupportUpdateArgs) =>
      apiClient.animalDonations.sendUpdate(animalId, body),
    ...options,
  });
};
