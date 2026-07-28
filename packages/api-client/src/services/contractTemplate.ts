import type {
  ContractTemplateResponse,
  UpdateContractTemplateBody,
  UpdateContractTemplateResponse,
} from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
import type { HttpFn } from "../utils";

export function createContractTemplateApiService(http: HttpFn) {
  return {
    get: (type: string) =>
      http<ContractTemplateResponse>({
        endpoint: endpoints.contractTemplate.get({ type }),
      }),

    update: (type: string, body: UpdateContractTemplateBody) =>
      http<UpdateContractTemplateResponse>({
        endpoint: endpoints.contractTemplate.update({ type }),
        method: "PUT",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      }),

    pdf: (type: string) =>
      http<Blob>({
        endpoint: endpoints.contractTemplate.pdf({ type }),
        responseType: "blob",
      }),
  };
}
