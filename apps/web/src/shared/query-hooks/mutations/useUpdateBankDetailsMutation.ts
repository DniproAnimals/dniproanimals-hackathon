"use client";

import { apiClient } from "@/shared/api-client";
import type { UpdateBankDetailsBody } from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateBankDetailsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UpdateBankDetailsBody) =>
      apiClient.bankDetails.update(body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [endpoints.bankDetails.get()],
      });
    },
  });
};
