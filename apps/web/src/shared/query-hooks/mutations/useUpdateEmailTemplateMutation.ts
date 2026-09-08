"use client";

import { apiClient } from "@/shared/api-client";
import type {
  EmailTemplateKey,
  UpdateEmailTemplateBody,
} from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type UpdateEmailTemplateArgs = {
  key: EmailTemplateKey;
  body: UpdateEmailTemplateBody;
};

export const useUpdateEmailTemplateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ key, body }: UpdateEmailTemplateArgs) =>
      apiClient.emailTemplates.update(key, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [endpoints.emailTemplates.list()],
      });
    },
  });
};
