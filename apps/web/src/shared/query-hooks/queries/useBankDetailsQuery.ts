"use client";

import { apiClient } from "@/shared/api-client";
import { endpoints } from "@dniproanimals/endpoints";
import { useQuery } from "@tanstack/react-query";

export const useBankDetailsQuery = () =>
  useQuery({
    queryKey: [endpoints.bankDetails.get()],
    queryFn: () => apiClient.bankDetails.get(),
  });
