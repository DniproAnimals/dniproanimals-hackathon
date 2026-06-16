import {
  adoptionStatsResponseSchema,
  createAdoptionBodySchema,
  createAdoptionResponseSchema,
  listAdoptionQuerySchema,
  listAdoptionResponseSchema,
  updateAdoptionStatusBodySchema,
  updateAdoptionStatusResponseSchema,
} from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
import { NotFoundError } from "../../shared/errors";
import { createController, defineRoute } from "../../shared/types/controller";
import { toAdoptionResponse } from "../../shared/utils/serializers";
import { animalsService } from "../animals/animals.service";
import { withAuth } from "../auth/auth.guard";
import { adoptionService } from "./adoption.service";

export const adoptionController = createController({
  list: defineRoute({
    method: "GET",
    url: endpoints.adoption.list(),
    schema: {
      querystring: listAdoptionQuerySchema,
      response: { 200: listAdoptionResponseSchema },
    },
    handler: async (request, reply) => {
      const rows = await adoptionService.list(request.query);
      return reply.send(
        rows.map((r) => ({
          ...toAdoptionResponse(r),
          animalName: r.animalName,
          animalType: r.animalType,
        })),
      );
    },
  }),

  stats: defineRoute({
    method: "GET",
    url: endpoints.adoption.stats(),
    schema: {
      response: { 200: adoptionStatsResponseSchema },
    },
    handler: withAuth(async (request, reply) => {
      const stats = await adoptionService.stats();
      return reply.send(stats);
    }),
  }),

  create: defineRoute({
    method: "POST",
    url: endpoints.adoption.create(),
    schema: {
      body: createAdoptionBodySchema,
      response: { 200: createAdoptionResponseSchema },
    },
    handler: async (request, reply) => {
      const exists = await animalsService.exists(request.body.animalId);
      if (!exists) throw new NotFoundError("Animal");
      const created = await adoptionService.create(request.body);
      return reply.send({ id: created.id, success: true });
    },
  }),

  updateStatus: defineRoute({
    method: "PATCH",
    url: endpoints.adoption.updateStatus(),
    schema: {
      body: updateAdoptionStatusBodySchema,
      response: { 200: updateAdoptionStatusResponseSchema },
    },
    handler: withAuth(async (request, reply) => {
      await adoptionService.updateStatus(request.body.id, request.body.status);
      if (request.body.status === "approved") {
        const animalId = await adoptionService.getAnimalId(request.body.id);
        if (animalId) await animalsService.markAdopted(animalId);
      }
      return reply.send({ success: true });
    }),
  }),
});
