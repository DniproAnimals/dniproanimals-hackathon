"use client";
import { apiClient } from "@/shared/query-client";
import { useMutation } from "@tanstack/react-query";

export function useUploadImageMutation() {
  return useMutation({
    mutationFn: (file: File) => apiClient.upload.image(file),
  });
}
