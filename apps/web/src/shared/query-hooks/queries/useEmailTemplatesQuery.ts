"use client";

import { apiClient } from "@/shared/api-client";
import { endpoints } from "@dniproanimals/endpoints";
import { useQuery } from "@tanstack/react-query";

export const useEmailTemplatesQuery = () =>
  useQuery({
    queryKey: [endpoints.emailTemplates.list()],
    queryFn: apiClient.emailTemplates.list,
  });
