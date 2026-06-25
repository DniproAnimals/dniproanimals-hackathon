import { apiClient } from "@/shared/api-client";
import { OmitMutationOptions } from "@/shared/types/react-query";
import { useMutation } from "@tanstack/react-query";

export const useResetPasswordMutation = (
  options: OmitMutationOptions<
    typeof apiClient.auth.resetPassword,
    "mutationFn"
  > = {},
) => {
  return useMutation({
    mutationFn: apiClient.auth.resetPassword,
    ...options,
  });
};
