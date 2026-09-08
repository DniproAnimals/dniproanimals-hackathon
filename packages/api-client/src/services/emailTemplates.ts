import type {
  EmailTemplate,
  EmailTemplateKey,
  UpdateEmailTemplateBody,
  UpdateEmailTemplateResponse,
} from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
import type { HttpFn } from "../utils";

export function createEmailTemplatesApiService(http: HttpFn) {
  return {
    list: () =>
      http<EmailTemplate[]>({
        endpoint: endpoints.emailTemplates.list(),
      }),
    update: (key: EmailTemplateKey, body: UpdateEmailTemplateBody) =>
      http<UpdateEmailTemplateResponse>({
        endpoint: endpoints.emailTemplates.update({ key }),
        method: "PUT",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      }),
  };
}
