import type {
  CreateOrganizationBody,
  CreateOrganizationResponse,
  GetOrganizationResponse,
  ListOrganizationsResponse,
  OrgAnimalsResponse,
  OrgVolunteersResponse,
  UpdateJarBody,
  UpdateJarResponse,
  UpdateOrgStatusBody,
  UpdateOrgStatusResponse,
  UpdateOwnOrganizationBody,
  UpdateOwnOrganizationResponse,
} from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
import type { HttpFn } from "../createHttp";

const JSON_HEADERS = { "Content-Type": "application/json" };

export function createOrganizationsApiService(http: HttpFn) {
  return {
    list: () =>
      http<ListOrganizationsResponse>({
        endpoint: endpoints.organizations.list(),
      }),
    get: (id: number) =>
      http<GetOrganizationResponse>({
        endpoint: endpoints.organizations.get({ id }),
      }),
    animals: (id: number) =>
      http<OrgAnimalsResponse>({
        endpoint: endpoints.organizations.animals({ id }),
      }),
    volunteers: (id: number) =>
      http<OrgVolunteersResponse>({
        endpoint: endpoints.organizations.volunteers({ id }),
      }),
    create: (body: CreateOrganizationBody) =>
      http<CreateOrganizationResponse>({
        endpoint: endpoints.organizations.create(),
        method: "POST",
        body: JSON.stringify(body),
        headers: JSON_HEADERS,
      }),
    updateStatus: (body: UpdateOrgStatusBody) =>
      http<UpdateOrgStatusResponse>({
        endpoint: endpoints.organizations.updateStatus(),
        method: "PATCH",
        body: JSON.stringify(body),
        headers: JSON_HEADERS,
      }),
    updateOwn: (body: UpdateOwnOrganizationBody) =>
      http<UpdateOwnOrganizationResponse>({
        endpoint: endpoints.organizations.updateOwn(),
        method: "PUT",
        body: JSON.stringify(body),
        headers: JSON_HEADERS,
      }),
    updateJar: (body: UpdateJarBody) =>
      http<UpdateJarResponse>({
        endpoint: endpoints.organizations.jar(),
        method: "PUT",
        body: JSON.stringify(body),
        headers: JSON_HEADERS,
      }),
  };
}
