import { apiClient } from "@/shared/api-client";
import { endpoints } from "@dniproanimals/endpoints";
import { useQuery } from "@tanstack/react-query";

export const useShelterNeedsQuery = () =>
  useQuery({
    queryKey: [endpoints.shelterNeeds.get()],
    queryFn: () => apiClient.shelterNeeds.get(),
  });
