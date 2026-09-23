import {
  emailTemplateContentSchema,
  type EmailTemplateKey,
  emailTemplateKeySchema,
  listEmailTemplatesResponseSchema,
  updateEmailTemplateResponseSchema,
} from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
import { z } from "zod";
import { createController, defineRoute } from "../../shared/types/controller";
import { withDashboardRole } from "../auth/auth.guard";
import { emailTemplateService } from "./email-template.service";

function toEmailTemplateResponse(template: {
  key: EmailTemplateKey;
  subject: string;
  preview: string;
  content: string;
  updatedAt: Date;
}) {
  return { ...template, updatedAt: template.updatedAt.toISOString() };
}

export const emailTemplateController = createController({
  list: defineRoute({
    method: "GET",
    url: endpoints.emailTemplates.list(),
    schema: {
      response: { 200: listEmailTemplatesResponseSchema },
    },
    handler: withDashboardRole(async (_request, reply) => {
      const templates = await emailTemplateService.list();
      return reply.send(templates.map(toEmailTemplateResponse));
    }),
  }),

  update: defineRoute({
    method: "PUT",
    url: endpoints.emailTemplates.update({ key: ":key" }),
    schema: {
      params: z.object({ key: emailTemplateKeySchema }),
      body: emailTemplateContentSchema,
      response: { 200: updateEmailTemplateResponseSchema },
    },
    handler: withDashboardRole(async (request, reply) => {
      await emailTemplateService.update(
        request.params.key,
        request.body,
        request.session.userId,
      );
      return reply.send({ success: true });
    }),
  }),
});
