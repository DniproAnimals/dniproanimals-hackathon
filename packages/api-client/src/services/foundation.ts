import type {
  Foundation,
  UpdateFoundationBody,
  UpdateFoundationResponse,
} from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
import type { HttpFn } from "../utils";

export function createFoundationApiService(http: HttpFn) {
  return {
    get: () =>
      http<Foundation>({
        endpoint: endpoints.foundation.get(),
        method: "GET",
      }),
    update: (body: UpdateFoundationBody) =>
      http<UpdateFoundationResponse>({
        endpoint: endpoints.foundation.update(),
        method: "PATCH",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      }),
  };
}
