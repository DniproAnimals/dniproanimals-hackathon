"use client";
import { apiClient } from "@/shared/api-client";
import type {
  UpdateAnimalBody,
  UpdateAnimalResponse,
} from "@dniproanimals/contracts";
import {
  useMutation,
  type UseMutationOptions,
} from "@tanstack/react-query";

type UpdateAnimalArgs = { id: number; body: UpdateAnimalBody };

export const useUpdateAnimalMutation = (
  options: Omit<
    UseMutationOptions<UpdateAnimalResponse, Error, UpdateAnimalArgs>,
    "mutationFn"
  > = {},
) => {
  return useMutation({
    mutationFn: ({ id, body }: UpdateAnimalArgs) =>
      apiClient.animals.update(id, body),
    ...options,
  });
};
