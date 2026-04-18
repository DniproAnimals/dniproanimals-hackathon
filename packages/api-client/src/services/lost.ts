import type {
  CreateLostBody,
  CreateLostResponse,
  ListLostQuery,
  ListLostResponse,
  UpdateLostBody,
  UpdateLostResponse,
} from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
import type { HttpFn } from "../utils";

export function createLostApiService(http: HttpFn) {
  return {
    list: (query?: ListLostQuery) =>
      http<ListLostResponse>({
        endpoint: endpoints.lost.list(),
        query,
      }),
    create: (body: CreateLostBody) =>
      http<CreateLostResponse>({
        endpoint: endpoints.lost.create(),
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      }),
    update: (id: number, body: UpdateLostBody) =>
      http<UpdateLostResponse>({
        endpoint: endpoints.lost.update({ id }),
        method: "PUT",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      }),
  };
}
