import type {
  ListUsersResponse,
  UpdateUserRoleBody,
  UpdateUserRoleResponse,
} from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
import type { HttpFn } from "../utils";

export function createUsersApiService(http: HttpFn) {
  return {
    list: () =>
      http<ListUsersResponse>({
        endpoint: endpoints.users.list(),
        method: "GET",
      }),
    updateRole: (body: UpdateUserRoleBody) =>
      http<UpdateUserRoleResponse>({
        endpoint: endpoints.users.updateRole(),
        method: "PATCH",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      }),
  };
}
