import { apiClient } from "@/shared/api-client";
import { endpoints } from "@dniproanimals/endpoints";
import { useQuery } from "@tanstack/react-query";

export const useUsersQuery = () =>
  useQuery({
    queryKey: [endpoints.users.list()],
    queryFn: () => apiClient.users.list(),
  });
