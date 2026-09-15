"use client";
import { apiClient } from "@/shared/api-client";
import type { OmitQueryOptions } from "@/shared/types/react-query";
import { endpoints } from "@dniproanimals/endpoints";
import { useQuery } from "@tanstack/react-query";

export const useAnimalDonationStatusQuery = (
  animalId: number,
  options: OmitQueryOptions<
    typeof apiClient.animalDonations.status,
    "queryKey" | "queryFn"
  > = {},
) => {
  return useQuery({
    queryKey: [endpoints.animalDonations.status({ animalId })],
    queryFn: () => apiClient.animalDonations.status(animalId),
    ...options,
  });
};
