"use client";
import { apiClient } from "@/shared/api-client";
import type {
  UpdateLostBody,
  UpdateLostResponse,
} from "@dniproanimals/contracts";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

type UpdateLostArgs = { id: number; body: UpdateLostBody };

export const useUpdateLostMutation = (
  options: Omit<
    UseMutationOptions<UpdateLostResponse, Error, UpdateLostArgs>,
    "mutationFn"
  > = {},
) => {
  return useMutation({
    mutationFn: ({ id, body }: UpdateLostArgs) =>
      apiClient.lost.update(id, body),
    ...options,
  });
};
