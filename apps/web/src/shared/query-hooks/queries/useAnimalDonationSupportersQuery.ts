"use client";
import { apiClient } from "@/shared/api-client";
import type { OmitQueryOptions } from "@/shared/types/react-query";
import { endpoints } from "@dniproanimals/endpoints";
import { useQuery } from "@tanstack/react-query";

export const useAnimalDonationSupportersQuery = (
  animalId: number,
  options: OmitQueryOptions<
    typeof apiClient.animalDonations.supporters,
    "queryKey" | "queryFn"
  > = {},
) => {
  return useQuery({
    queryKey: [endpoints.animalDonations.supporters({ animalId })],
    queryFn: () => apiClient.animalDonations.supporters(animalId),
    ...options,
  });
};
