import type {
  SuperadminDeleteOrgBody,
  SuperadminDeleteOrgResponse,
  SuperadminListOrgsQuery,
  SuperadminListOrgsResponse,
  SuperadminOrgsStatsResponse,
  SuperadminUpdateOrgBody,
  SuperadminUpdateOrgResponse,
} from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
import type { HttpFn } from "../utils";

export function createSuperadminApiService(http: HttpFn) {
  return {
    listOrgs: (query: SuperadminListOrgsQuery = {}) =>
      http<SuperadminListOrgsResponse>({
        endpoint: endpoints.superadmin.listOrgs(),
        query,
      }),
    orgsStats: () =>
      http<SuperadminOrgsStatsResponse>({
        endpoint: endpoints.superadmin.orgsStats(),
      }),
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
