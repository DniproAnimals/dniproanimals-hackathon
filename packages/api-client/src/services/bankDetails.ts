import type {
  BankDetails,
  UpdateBankDetailsBody,
  UpdateBankDetailsResponse,
} from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
import type { HttpFn } from "../utils";

export function createBankDetailsApiService(http: HttpFn) {
  return {
    get: () =>
      http<BankDetails>({
        endpoint: endpoints.bankDetails.get(),
        method: "GET",
      }),
    update: (body: UpdateBankDetailsBody) =>
      http<UpdateBankDetailsResponse>({
        endpoint: endpoints.bankDetails.update(),
        method: "PATCH",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      }),
  };
}
