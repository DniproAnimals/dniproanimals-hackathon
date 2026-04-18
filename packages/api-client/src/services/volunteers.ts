import type {
  AcceptInviteBody,
  AcceptInviteResponse,
  CreateVolunteerBody,
  CreateVolunteerResponse,
  DeleteVolunteerBody,
  DeleteVolunteerResponse,
  InviteInfoQuery,
  InviteInfoResponse,
  ListVolunteersQuery,
  ListVolunteersResponse,
  UpdateVolunteerBody,
  UpdateVolunteerResponse,
  VolunteersStatsResponse,
} from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
import type { HttpFn } from "../utils";

export function createVolunteersApiService(http: HttpFn) {
  return {
    list: (query: ListVolunteersQuery = {}) =>
      http<ListVolunteersResponse>({
        endpoint: endpoints.volunteers.list(),
        query,
      }),
    stats: () =>
      http<VolunteersStatsResponse>({
        endpoint: endpoints.volunteers.stats(),
      }),
    create: (body: CreateVolunteerBody) =>
      http<CreateVolunteerResponse>({
        endpoint: endpoints.volunteers.create(),
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      }),
    update: (body: UpdateVolunteerBody) =>
      http<UpdateVolunteerResponse>({
        endpoint: endpoints.volunteers.update(),
        method: "PUT",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      }),
    delete: (body: DeleteVolunteerBody) =>
      http<DeleteVolunteerResponse>({
        endpoint: endpoints.volunteers.delete(),
        method: "DELETE",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
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
        headers: { "Content-Type": "application/json" },
      }),
  };
}
