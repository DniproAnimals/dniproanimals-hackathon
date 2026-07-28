import { apiClient } from "@/shared/api-client";
import type { UpdateContractTemplateBody } from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateContractTemplateMutation = (type: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UpdateContractTemplateBody) =>
      apiClient.contractTemplate.update(type, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [endpoints.contractTemplate.get({ type })],
      });
    },
  });
};
