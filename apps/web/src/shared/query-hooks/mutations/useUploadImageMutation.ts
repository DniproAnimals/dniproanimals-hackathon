"use client";
import { apiClient } from "@/shared/api-client";
import type { UploadImageResponse } from "@dniproanimals/contracts";
import {
  useMutation,
  type UseMutationOptions,
} from "@tanstack/react-query";

export const useUploadImageMutation = (
  options: Omit<
    UseMutationOptions<UploadImageResponse, Error, File>,
    "mutationFn"
  > = {},
) => {
  return useMutation({
    mutationFn: (file: File) => apiClient.upload.image(file),
    ...options,
  });
};
