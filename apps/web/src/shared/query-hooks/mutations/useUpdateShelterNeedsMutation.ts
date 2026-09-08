import { apiClient } from "@/shared/api-client";
import type { UpdateShelterNeedsBody } from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateShelterNeedsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UpdateShelterNeedsBody) =>
      apiClient.shelterNeeds.update(body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [endpoints.shelterNeeds.get()],
      });
    },
  });
};
