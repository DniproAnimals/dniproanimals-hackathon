import type {
  CreateAdoptionBody,
  CreateAdoptionResponse,
  ListAdoptionQuery,
  ListAdoptionResponse,
  UpdateAdoptionStatusBody,
  UpdateAdoptionStatusResponse,
} from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
import type { HttpFn } from "../createHttp";

const JSON_HEADERS = { "Content-Type": "application/json" };

export function createAdoptionApiService(http: HttpFn) {
  return {
    list: (query?: ListAdoptionQuery) =>
      http<ListAdoptionResponse>({
        endpoint: endpoints.adoption.list(),
        query,
      }),
    create: (body: CreateAdoptionBody) =>
      http<CreateAdoptionResponse>({
        endpoint: endpoints.adoption.create(),
        method: "POST",
        body: JSON.stringify(body),
        headers: JSON_HEADERS,
      }),
    updateStatus: (body: UpdateAdoptionStatusBody) =>
      http<UpdateAdoptionStatusResponse>({
        endpoint: endpoints.adoption.updateStatus(),
        method: "PATCH",
        body: JSON.stringify(body),
        headers: JSON_HEADERS,
      }),
  };
}
