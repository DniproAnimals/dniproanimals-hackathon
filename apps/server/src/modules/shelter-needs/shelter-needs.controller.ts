import {
  shelterNeedsSchema,
  updateShelterNeedsBodySchema,
  updateShelterNeedsResponseSchema,
} from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
import { z } from "zod";
import { createController, defineRoute } from "../../shared/types/controller";
import { withAuth } from "../auth/auth.guard";
import { shelterNeedsService } from "./shelter-needs.service";

export const shelterNeedsController = createController({
  get: defineRoute({
    method: "GET",
    url: endpoints.shelterNeeds.get(),
    schema: {
      response: {
        200: shelterNeedsSchema,
        404: z.object({ message: z.string() }),
      },
    },
    handler: async (_request, reply) => {
      const data = await shelterNeedsService.get();
      if (!data) {
        return reply.code(404).send({ message: "Shelter needs not found" });
      }
      return reply.send(data);
    },
  }),
  update: defineRoute({
    method: "PATCH",
    url: endpoints.shelterNeeds.update(),
    schema: {
      body: updateShelterNeedsBodySchema,
      response: { 200: updateShelterNeedsResponseSchema },
    },
    handler: withAuth(async (request, reply) => {
      const result = await shelterNeedsService.update(request.body);
      return reply.send(result);
    }),
  }),
});
