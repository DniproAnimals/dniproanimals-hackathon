import {
  addBreedsBodySchema,
  addBreedsResponseSchema,
  animalsStatsResponseSchema,
  createAnimalBodySchema,
  createAnimalResponseSchema,
  createSpeciesBodySchema,
  createSpeciesResponseSchema,
  deleteAnimalParamsSchema,
  deleteAnimalResponseSchema,
  getAnimalParamsSchema,
  getAnimalResponseSchema,
  listAnimalsQuerySchema,
  listAnimalsResponseSchema,
  listBreedsQuerySchema,
  listBreedsResponseSchema,
  listSpeciesResponseSchema,
  updateAnimalBodySchema,
  updateAnimalParamsSchema,
  updateAnimalResponseSchema,
} from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
import { NotFoundError } from "../../shared/errors";
import { createController, defineRoute } from "../../shared/types/controller";
import {
  toAnimalResponse,
  toBreedResponse,
  toSpeciesResponse,
} from "../../shared/utils/serializers";
import { withAuth } from "../auth/auth.guard";
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
      const stats = await animalsService.stats();
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
      return reply.send(toAnimalResponse(animal));
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
      const created = await animalsService.create(request.body);
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

  listSpecies: defineRoute({
    method: "GET",
    url: endpoints.animals.listSpecies(),
    schema: {
      response: { 200: listSpeciesResponseSchema },
    },
    handler: async (request, reply) => {
      const rows = await animalsService.listSpecies();
      return reply.send(rows.map(toSpeciesResponse));
    },
  }),

  listBreeds: defineRoute({
    method: "GET",
    url: endpoints.animals.listBreeds(),
    schema: {
      querystring: listBreedsQuerySchema,
      response: { 200: listBreedsResponseSchema },
    },
    handler: async (request, reply) => {
      const rows = await animalsService.listBreeds(request.query);
      return reply.send(rows.map(toBreedResponse));
    },
  }),

  createSpecies: defineRoute({
    method: "POST",
    url: endpoints.animals.createSpecies(),
    schema: {
      body: createSpeciesBodySchema,
      response: { 200: createSpeciesResponseSchema },
    },
    handler: withAuth(async (request, reply) => {
      const created = await animalsService.createSpecies(request.body);
      return reply.send(toSpeciesResponse(created));
    }),
  }),

  addBreeds: defineRoute({
    method: "POST",
    url: endpoints.animals.addBreeds(),
    schema: {
      body: addBreedsBodySchema,
      response: { 200: addBreedsResponseSchema },
    },
    handler: withAuth(async (request, reply) => {
      const result = await animalsService.addBreeds(request.body);
      return reply.send(result);
    }),
  }),
});
