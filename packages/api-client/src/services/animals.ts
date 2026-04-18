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
import type { HttpFn } from "../utils";


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
        headers: { "Content-Type": "application/json" },
      }),
    update: (id: number, body: UpdateAnimalBody) =>
      http<UpdateAnimalResponse>({
        endpoint: endpoints.animals.update({ id }),
        method: "PUT",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      }),
    delete: (id: number) =>
      http<DeleteAnimalResponse>({
        endpoint: endpoints.animals.delete({ id }),
        method: "DELETE",
      }),
  };
}
