import type {
  AnimalDonationResponse,
  AnimalDonationSupportersSummary,
  SendAnimalSupportUpdateBody,
  SendAnimalSupportUpdateResponse,
} from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
import type { HttpFn } from "../utils";

export function createAnimalDonationsApiService(http: HttpFn) {
  return {
    status: (animalId: number) =>
      http<AnimalDonationResponse>({
        endpoint: endpoints.animalDonations.status({ animalId }),
      }),
    start: (animalId: number) =>
      http<AnimalDonationResponse>({
        endpoint: endpoints.animalDonations.start({ animalId }),
        method: "POST",
      }),
    cancel: (animalId: number) =>
      http<AnimalDonationResponse>({
        endpoint: endpoints.animalDonations.cancel({ animalId }),
        method: "DELETE",
      }),
    supporters: (animalId: number) =>
      http<AnimalDonationSupportersSummary>({
        endpoint: endpoints.animalDonations.supporters({ animalId }),
      }),
    sendUpdate: (animalId: number, body: SendAnimalSupportUpdateBody) =>
      http<SendAnimalSupportUpdateResponse>({
        endpoint: endpoints.animalDonations.sendUpdate({ animalId }),
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      }),
  };
}
