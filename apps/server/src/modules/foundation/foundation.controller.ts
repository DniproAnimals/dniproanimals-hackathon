import {
  foundationSchema,
  updateFoundationBodySchema,
  updateFoundationResponseSchema,
} from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
import { createController, defineRoute } from "../../shared/types/controller";
import { withAuth } from "../auth/auth.guard";
import { foundationService } from "./foundation.service";

export const foundationController = createController({
  get: defineRoute({
    method: "GET",
    url: endpoints.foundation.get(),
    schema: {
      response: { 200: foundationSchema },
    },
    handler: async (request, reply) => {
      const data = await foundationService.get();
      return reply.send(data);
    },
  }),

  update: defineRoute({
    method: "PATCH", // Changed to PATCH to match endpoints if needed, or stick to POST/PUT
    url: endpoints.foundation.update(),
    schema: {
      body: updateFoundationBodySchema,
      response: { 200: updateFoundationResponseSchema },
    },
    handler: withAuth(async (request, reply) => {
      // Only admins and volunteers can update foundation info
      const result = await foundationService.update(request.body);
      return reply.send(result);
    }),
  }),
});
