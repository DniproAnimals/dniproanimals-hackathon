import { apiClient } from "@/shared/api-client";
import { endpoints } from "@dniproanimals/endpoints";
import { useQuery } from "@tanstack/react-query";

export const useFoundationQuery = () =>
  useQuery({
    queryKey: [endpoints.foundation.get()],
    queryFn: () => apiClient.foundation.get(),
  });
