import {
  sendTestEmailBodySchema,
  sendTestEmailResponseSchema,
} from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
import { createController, defineRoute } from "../../shared/types/controller";
import { mailService } from "./mail.service";

export const mailController = createController({
  sendTestEmail: defineRoute({
    method: "POST",
    url: endpoints.mail.test(),
    schema: {
      body: sendTestEmailBodySchema,
      response: { 200: sendTestEmailResponseSchema },
    },
    handler: async (request, reply) => {
      await mailService.sendTestEmail(request.body);
      return reply.send({ success: true });
    },
  }),
});
