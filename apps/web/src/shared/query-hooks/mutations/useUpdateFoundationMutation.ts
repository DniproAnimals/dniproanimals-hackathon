import { apiClient } from "@/shared/api-client";
import type { UpdateFoundationBody } from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateFoundationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateFoundationBody) =>
      apiClient.foundation.update(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [endpoints.foundation.get()] });
    },
  });
};
