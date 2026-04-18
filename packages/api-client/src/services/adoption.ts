import type {
  AdoptionStatsResponse,
  CreateAdoptionBody,
  CreateAdoptionResponse,
  ListAdoptionQuery,
  ListAdoptionResponse,
  UpdateAdoptionStatusBody,
  UpdateAdoptionStatusResponse,
} from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
import type { HttpFn } from "../utils";

export function createAdoptionApiService(http: HttpFn) {
  return {
    list: (query?: ListAdoptionQuery) =>
      http<ListAdoptionResponse>({
        endpoint: endpoints.adoption.list(),
        query,
      }),
    stats: () =>
      http<AdoptionStatsResponse>({
        endpoint: endpoints.adoption.stats(),
      }),
    create: (body: CreateAdoptionBody) =>
      http<CreateAdoptionResponse>({
        endpoint: endpoints.adoption.create(),
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      }),
    updateStatus: (body: UpdateAdoptionStatusBody) =>
      http<UpdateAdoptionStatusResponse>({
        endpoint: endpoints.adoption.updateStatus(),
        method: "PATCH",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      }),
  };
}
