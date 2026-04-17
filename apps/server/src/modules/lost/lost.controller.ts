import {
  createLostBodySchema,
  createLostResponseSchema,
  listLostQuerySchema,
  listLostResponseSchema,
  updateLostBodySchema,
  updateLostParamsSchema,
  updateLostResponseSchema,
} from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
import { NotFoundError } from "../../shared/errors";
import { createController, defineRoute } from "../../shared/types/controller";
import { toLostResponse } from "../../shared/utils/serializers";
import { lostService } from "./lost.service";

export const lostController = createController({
  list: defineRoute({
    method: "GET",
    url: endpoints.lost.list(),
    schema: {
      querystring: listLostQuerySchema,
      response: { 200: listLostResponseSchema },
    },
    handler: async (request, reply) => {
      const rows = await lostService.list(request.query.type);
      return reply.send(rows.map(toLostResponse));
    },
  }),

  create: defineRoute({
    method: "POST",
    url: endpoints.lost.create(),
    schema: {
      body: createLostBodySchema,
      response: { 200: createLostResponseSchema },
    },
    handler: async (request, reply) => {
      const created = await lostService.create(request.body);
      return reply.send({ id: created.id, success: true });
    },
  }),

  update: defineRoute({
    method: "PUT",
    url: endpoints.lost.update({ id: ":id" }),
    schema: {
      params: updateLostParamsSchema,
      body: updateLostBodySchema,
      response: { 200: updateLostResponseSchema },
    },
    handler: async (request, reply) => {
      const exists = await lostService.exists(request.params.id);
      if (!exists) throw new NotFoundError("Lost animal");
      const updated = await lostService.update(request.params.id, request.body);
      if (!updated) throw new NotFoundError("Lost animal");
      return reply.send(toLostResponse(updated));
    },
  }),
});
