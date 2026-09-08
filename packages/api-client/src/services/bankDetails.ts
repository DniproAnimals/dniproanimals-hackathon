import type { BankDetails } from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
import type { HttpFn } from "../utils";

export function createBankDetailsApiService(http: HttpFn) {
  return {
    get: () =>
      http<BankDetails>({
        endpoint: endpoints.bankDetails.get(),
        method: "GET",
      }),
  };
}
