import type {
  CreateAnimalBody,
  CreateAnimalResponse,
  DeleteAnimalResponse,
  GetAnimalResponse,
  ListAnimalsQuery,
  ListAnimalsResponse,
  UpdateAnimalBody,
  UpdateAnimalResponse,
} from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
import type { HttpFn } from "../createHttp";

const JSON_HEADERS = { "Content-Type": "application/json" };

export function createAnimalsApiService(http: HttpFn) {
  return {
    list: (query?: ListAnimalsQuery) =>
      http<ListAnimalsResponse>({
        endpoint: endpoints.animals.list(),
        query,
      }),
    get: (id: number) =>
      http<GetAnimalResponse>({
        endpoint: endpoints.animals.get({ id }),
      }),
    create: (body: CreateAnimalBody) =>
      http<CreateAnimalResponse>({
        endpoint: endpoints.animals.create(),
        method: "POST",
        body: JSON.stringify(body),
        headers: JSON_HEADERS,
      }),
    update: (id: number, body: UpdateAnimalBody) =>
      http<UpdateAnimalResponse>({
        endpoint: endpoints.animals.update({ id }),
        method: "PUT",
        body: JSON.stringify(body),
        headers: JSON_HEADERS,
      }),
    delete: (id: number) =>
      http<DeleteAnimalResponse>({
        endpoint: endpoints.animals.delete({ id }),
        method: "DELETE",
      }),
  };
}
