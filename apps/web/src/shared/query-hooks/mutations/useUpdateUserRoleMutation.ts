import { apiClient } from "@/shared/api-client";
import type { UpdateUserRoleBody } from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateUserRoleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateUserRoleBody) => apiClient.users.updateRole(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [endpoints.users.list()] });
    },
  });
};
