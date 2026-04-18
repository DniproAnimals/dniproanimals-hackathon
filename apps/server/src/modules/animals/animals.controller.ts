import {
  animalsStatsResponseSchema,
  createAnimalBodySchema,
  createAnimalResponseSchema,
  deleteAnimalParamsSchema,
  deleteAnimalResponseSchema,
  getAnimalParamsSchema,
  getAnimalResponseSchema,
  listAnimalsQuerySchema,
  listAnimalsResponseSchema,
  updateAnimalBodySchema,
  updateAnimalParamsSchema,
  updateAnimalResponseSchema,
} from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
import { NotFoundError, UnauthorizedError } from "../../shared/errors";
import { createController, defineRoute } from "../../shared/types/controller";
import { toAnimalResponse } from "../../shared/utils/serializers";
import { withAuth } from "../auth/auth.guard";
import { usersService } from "../users/users.service";
import { animalsService } from "./animals.service";

export const animalsController = createController({
  list: defineRoute({
    method: "GET",
    url: endpoints.animals.list(),
    schema: {
      querystring: listAnimalsQuerySchema,
      response: { 200: listAnimalsResponseSchema },
    },
    handler: async (request, reply) => {
      const rows = await animalsService.list(request.query);
      return reply.send(rows.map(toAnimalResponse));
    },
  }),

  stats: defineRoute({
    method: "GET",
    url: endpoints.animals.stats(),
    schema: {
      response: { 200: animalsStatsResponseSchema },
    },
    handler: withAuth(async (request, reply) => {
      const user = await usersService.getById(request.session.userId);
      if (!user?.orgId) throw new UnauthorizedError();
      const stats = await animalsService.statsByOrg(user.orgId);
      return reply.send(stats);
    }),
  }),

  get: defineRoute({
    method: "GET",
    url: endpoints.animals.get({ id: ":id" }),
    schema: {
      params: getAnimalParamsSchema,
      response: { 200: getAnimalResponseSchema },
    },
    handler: async (request, reply) => {
      const animal = await animalsService.getById(request.params.id);
      if (!animal) throw new NotFoundError("Animal");
      const org = animal.orgId
        ? await animalsService.getOrgRef(animal.orgId)
        : null;
      return reply.send({
        ...toAnimalResponse(animal),
        org: org
          ? {
              id: org.id,
              name: org.name,
              photo: org.photo ?? null,
              location: org.location ?? null,
            }
          : null,
      });
    },
  }),

  create: defineRoute({
    method: "POST",
    url: endpoints.animals.create(),
    schema: {
      body: createAnimalBodySchema,
      response: { 200: createAnimalResponseSchema },
    },
    handler: withAuth(async (request, reply) => {
      const user = await usersService.getById(request.session.userId);
      const orgId = user?.orgId ?? null;
      const created = await animalsService.create(request.body, orgId);
      return reply.send(toAnimalResponse(created));
    }),
  }),

  update: defineRoute({
    method: "PUT",
    url: endpoints.animals.update({ id: ":id" }),
    schema: {
      params: updateAnimalParamsSchema,
      body: updateAnimalBodySchema,
      response: { 200: updateAnimalResponseSchema },
    },
    handler: withAuth(async (request, reply) => {
      const exists = await animalsService.exists(request.params.id);
      if (!exists) throw new NotFoundError("Animal");
      const updated = await animalsService.update(
        request.params.id,
        request.body,
      );
      if (!updated) throw new NotFoundError("Animal");
      return reply.send(toAnimalResponse(updated));
    }),
  }),

  delete: defineRoute({
    method: "DELETE",
    url: endpoints.animals.delete({ id: ":id" }),
    schema: {
      params: deleteAnimalParamsSchema,
      response: { 200: deleteAnimalResponseSchema },
    },
    handler: withAuth(async (request, reply) => {
      const exists = await animalsService.exists(request.params.id);
      if (!exists) throw new NotFoundError("Animal");
      await animalsService.delete(request.params.id);
      return reply.send({ success: true });
    }),
  }),
});
