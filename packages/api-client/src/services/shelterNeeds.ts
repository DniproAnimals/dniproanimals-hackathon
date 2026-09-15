import type {
  ShelterNeeds,
  UpdateShelterNeedsBody,
  UpdateShelterNeedsResponse,
} from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
import type { HttpFn } from "../utils";

export function createShelterNeedsApiService(http: HttpFn) {
  return {
    get: () =>
      http<ShelterNeeds>({
        endpoint: endpoints.shelterNeeds.get(),
        method: "GET",
      }),
    update: (body: UpdateShelterNeedsBody) =>
      http<UpdateShelterNeedsResponse>({
        endpoint: endpoints.shelterNeeds.update(),
        method: "PATCH",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      }),
  };
}
