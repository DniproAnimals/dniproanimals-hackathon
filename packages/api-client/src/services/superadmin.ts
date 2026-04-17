import type {
  SuperadminDeleteOrgBody,
  SuperadminDeleteOrgResponse,
  SuperadminUpdateOrgBody,
  SuperadminUpdateOrgResponse,
} from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
import type { HttpFn } from "../createHttp";

const JSON_HEADERS = { "Content-Type": "application/json" };

export function createSuperadminApiService(http: HttpFn) {
  return {
    updateOrg: (body: SuperadminUpdateOrgBody) =>
      http<SuperadminUpdateOrgResponse>({
        endpoint: endpoints.superadmin.updateOrg(),
        method: "PUT",
        body: JSON.stringify(body),
        headers: JSON_HEADERS,
      }),
    deleteOrg: (body: SuperadminDeleteOrgBody) =>
      http<SuperadminDeleteOrgResponse>({
        endpoint: endpoints.superadmin.deleteOrg(),
        method: "DELETE",
        body: JSON.stringify(body),
        headers: JSON_HEADERS,
      }),
  };
}
