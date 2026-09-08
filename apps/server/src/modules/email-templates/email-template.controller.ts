import {
  emailTemplateContentSchema,
  type EmailTemplateKey,
  emailTemplateKeySchema,
  listEmailTemplatesResponseSchema,
  updateEmailTemplateResponseSchema,
} from "@dniproanimals/contracts";
import { db, eq, usersTable } from "@dniproanimals/database";
import { endpoints } from "@dniproanimals/endpoints";
import { z } from "zod";
import { ForbiddenError } from "../../shared/errors";
import { createController, defineRoute } from "../../shared/types/controller";
import { withAuth } from "../auth/auth.guard";
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

async function ensureSuperadmin(userId: number) {
  const [user] = await db
    .select({ role: usersTable.role })
    .from(usersTable)
    .where(eq(usersTable.id, userId))
    .limit(1);

  if (user?.role !== "superadmin") throw new ForbiddenError();
}

export const emailTemplateController = createController({
  list: defineRoute({
    method: "GET",
    url: endpoints.emailTemplates.list(),
    schema: {
      response: { 200: listEmailTemplatesResponseSchema },
    },
    handler: withAuth(async (request, reply) => {
      await ensureSuperadmin(request.session.userId);
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
    handler: withAuth(async (request, reply) => {
      await ensureSuperadmin(request.session.userId);
      await emailTemplateService.update(
        request.params.key,
        request.body,
        request.session.userId,
      );
      return reply.send({ success: true });
    }),
  }),
});
