import {
  bankDetailsSchema,
  updateBankDetailsBodySchema,
  updateBankDetailsResponseSchema,
} from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
import { z } from "zod";
import { createController, defineRoute } from "../../shared/types/controller";
import { withAuth } from "../auth/auth.guard";
import { bankDetailsService } from "./bank-details.service";

export const bankDetailsController = createController({
  get: defineRoute({
    method: "GET",
    url: endpoints.bankDetails.get(),
    schema: {
      response: {
        200: bankDetailsSchema,
        404: z.object({ message: z.string() }),
      },
    },
    handler: async (_request, reply) => {
      const data = await bankDetailsService.get();
      if (!data) {
        return reply.code(404).send({ message: "Bank details not found" });
      }
      return reply.send(data);
    },
  }),
  update: defineRoute({
    method: "PATCH",
    url: endpoints.bankDetails.update(),
    schema: {
      body: updateBankDetailsBodySchema,
      response: { 200: updateBankDetailsResponseSchema },
    },
    handler: withAuth(async (request, reply) => {
      const result = await bankDetailsService.update(request.body);
      return reply.send(result);
    }),
  }),
});
