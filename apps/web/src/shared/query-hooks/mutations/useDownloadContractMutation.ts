"use client";

import { apiClient } from "@/shared/api-client";
import type { OmitMutationOptions } from "@/shared/types/react-query";
import { useMutation } from "@tanstack/react-query";

export const useDownloadContractMutation = (
  options: OmitMutationOptions<
    typeof apiClient.contractTemplate.pdf,
    "mutationFn"
  > = {},
) => {
  return useMutation({
    mutationFn: apiClient.contractTemplate.pdf,
    ...options,
  });
};
