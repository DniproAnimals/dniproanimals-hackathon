import {
  contractTemplateResponseSchema,
  updateContractTemplateBodySchema,
  updateContractTemplateResponseSchema,
} from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
import { z } from "zod";
import { NotFoundError } from "../../shared/errors";
import { createController, defineRoute } from "../../shared/types/controller";
import { withAuth } from "../auth/auth.guard";
import { contractTemplatePdfService } from "./contract-template-pdf.service";
import { contractTemplateService } from "./contract-template.service";

export const contractTemplateController = createController({
  get: defineRoute({
    method: "GET",
    url: endpoints.contractTemplate.get({ type: ":type" }),
    schema: {
      params: z.object({ type: z.string() }),
      response: { 200: contractTemplateResponseSchema },
    },
    handler: withAuth(async (request, reply) => {
      const row = await contractTemplateService.getActive(request.params.type);
      if (!row) throw new NotFoundError("Contract template");

      return reply.send({
        ...row,
        updatedAt: row.updatedAt.toISOString(),
      });
    }),
  }),
  pdf: defineRoute({
    method: "GET",
    url: endpoints.contractTemplate.pdf({ type: ":type" }),
    schema: {
      params: z.object({
        type: z.string(),
      }),
    },
    handler: withAuth(async (request, reply) => {
      const pdf = await contractTemplatePdfService.generate(
        request.params.type,
      );

      reply
        .type("application/pdf")
        .header(
          "Content-Disposition",
          `attachment; filename="${request.params.type}.pdf"`,
        );

      return reply.send(pdf);
    }),
  }),
  update: defineRoute({
    method: "PUT",
    url: endpoints.contractTemplate.update({ type: ":type" }),
    schema: {
      params: z.object({ type: z.string() }),
      body: updateContractTemplateBodySchema,
      response: { 200: updateContractTemplateResponseSchema },
    },
    handler: withAuth(async (request, reply) => {
      await contractTemplateService.update(
        request.params.type,
        request.body,
        request.session.userId as number,
      );
      return reply.send({ success: true });
    }),
  }),
});
