import { apiClient } from "@/shared/api-client";
import { endpoints } from "@dniproanimals/endpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { OmitMutationOptions } from "../../types/react-query";

export const useAddBreedsMutation = (
  options: OmitMutationOptions<
    typeof apiClient.animals.addBreeds,
    "mutationFn"
  > = {},
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: apiClient.animals.addBreeds,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: [endpoints.animals.listSpecies()],
      });
      options.onSuccess?.(...args);
    },
    ...options,
  });
};
