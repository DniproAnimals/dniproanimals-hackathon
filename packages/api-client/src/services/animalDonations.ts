import type {
  AnimalDonationResponse,
  AnimalDonationSupportersSummary,
  SendAnimalSupportUpdateBody,
  SendAnimalSupportUpdateResponse,
  StartAnimalDonationBody,
} from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
import type { HttpFn } from "../utils";

export function createAnimalDonationsApiService(http: HttpFn) {
  return {
    status: (animalId: number) =>
      http<AnimalDonationResponse>({
        endpoint: endpoints.animalDonations.status({ animalId }),
      }),
    start: (animalId: number, body: StartAnimalDonationBody) =>
      http<AnimalDonationResponse>({
        endpoint: endpoints.animalDonations.start({ animalId }),
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
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
    deactivateSupporter: (animalId: number, userId: number) =>
      http<AnimalDonationResponse>({
        endpoint: endpoints.animalDonations.deactivateSupporter({
          animalId,
          userId,
        }),
        method: "DELETE",
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
