import { apiClient } from "@/shared/api-client";
import { OmitMutationOptions } from "@/shared/types/react-query";
import { useMutation } from "@tanstack/react-query";

export const useForgotPasswordMutation = (
  options: OmitMutationOptions<
    typeof apiClient.auth.forgotPassword,
    "mutationFn"
  > = {},
) => {
  return useMutation({
    mutationFn: apiClient.auth.forgotPassword,
    ...options,
  });
};
