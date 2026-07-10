import { apiClient } from "@/shared/api-client";
import { endpoints } from "@dniproanimals/endpoints";
import { useQuery } from "@tanstack/react-query";

export const useContractTemplateQuery = (type: string) =>
  useQuery({
    queryKey: [endpoints.contractTemplate.get({ type })],
    queryFn: () => apiClient.contractTemplate.get(type),
  });
