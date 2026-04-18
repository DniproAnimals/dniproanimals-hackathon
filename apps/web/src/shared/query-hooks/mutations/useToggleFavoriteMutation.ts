"use client";
import { apiClient } from "@/shared/api-client";
import type { OmitMutationOptions } from "@/shared/types/react-query";
import { useMutation } from "@tanstack/react-query";

export const useToggleFavoriteMutation = (
  options: OmitMutationOptions<
    typeof apiClient.favorites.toggle,
    "mutationFn"
  > = {},
) => {
  return useMutation({
    mutationFn: apiClient.favorites.toggle,
    ...options,
  });
};
