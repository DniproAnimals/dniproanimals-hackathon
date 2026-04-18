import type {
  SuperadminDeleteOrgBody,
  SuperadminDeleteOrgResponse,
  SuperadminUpdateOrgBody,
  SuperadminUpdateOrgResponse,
} from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
import type { HttpFn } from "../createHttp";

export function createSuperadminApiService(http: HttpFn) {
  return {
    updateOrg: (body: SuperadminUpdateOrgBody) =>
      http<SuperadminUpdateOrgResponse>({
        endpoint: endpoints.superadmin.updateOrg(),
        method: "PUT",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      }),
    deleteOrg: (body: SuperadminDeleteOrgBody) =>
      http<SuperadminDeleteOrgResponse>({
        endpoint: endpoints.superadmin.deleteOrg(),
        method: "DELETE",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      }),
  };
}
