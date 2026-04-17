import type {
  AcceptInviteBody,
  AcceptInviteResponse,
  CreateVolunteerBody,
  CreateVolunteerResponse,
  DeleteVolunteerBody,
  DeleteVolunteerResponse,
  InviteInfoQuery,
  InviteInfoResponse,
  ListVolunteersResponse,
  UpdateVolunteerBody,
  UpdateVolunteerResponse,
} from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
import type { HttpFn } from "../createHttp";

const JSON_HEADERS = { "Content-Type": "application/json" };

export function createVolunteersApiService(http: HttpFn) {
  return {
    list: () =>
      http<ListVolunteersResponse>({
        endpoint: endpoints.volunteers.list(),
      }),
    create: (body: CreateVolunteerBody) =>
      http<CreateVolunteerResponse>({
        endpoint: endpoints.volunteers.create(),
        method: "POST",
        body: JSON.stringify(body),
        headers: JSON_HEADERS,
      }),
    update: (body: UpdateVolunteerBody) =>
      http<UpdateVolunteerResponse>({
        endpoint: endpoints.volunteers.update(),
        method: "PUT",
        body: JSON.stringify(body),
        headers: JSON_HEADERS,
      }),
    delete: (body: DeleteVolunteerBody) =>
      http<DeleteVolunteerResponse>({
        endpoint: endpoints.volunteers.delete(),
        method: "DELETE",
        body: JSON.stringify(body),
        headers: JSON_HEADERS,
      }),
    inviteInfo: (query: InviteInfoQuery) =>
      http<InviteInfoResponse>({
        endpoint: endpoints.volunteers.invite(),
        query,
      }),
    acceptInvite: (body: AcceptInviteBody) =>
      http<AcceptInviteResponse>({
        endpoint: endpoints.volunteers.invite(),
        method: "POST",
        body: JSON.stringify(body),
        headers: JSON_HEADERS,
      }),
  };
}
