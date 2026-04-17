import {
  listFavoritesResponseSchema,
  toggleFavoriteBodySchema,
  toggleFavoriteResponseSchema,
} from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
import { createController, defineRoute } from "../../shared/types/controller";
import { toAnimalResponse } from "../../shared/utils/serializers";
import { withAuth } from "../auth/auth.guard";
import { favoritesService } from "./favorites.service";

export const favoritesController = createController({
  list: defineRoute({
    method: "GET",
    url: endpoints.favorites.list(),
    schema: {
      response: { 200: listFavoritesResponseSchema },
    },
    handler: withAuth(async (request, reply) => {
      const animals = await favoritesService.listByUser(request.session.userId);
      return reply.send(animals.map(toAnimalResponse));
    }),
  }),

  toggle: defineRoute({
    method: "POST",
    url: endpoints.favorites.toggle(),
    schema: {
      body: toggleFavoriteBodySchema,
      response: { 200: toggleFavoriteResponseSchema },
    },
    handler: withAuth(async (request, reply) => {
      const favorited = await favoritesService.toggle(
        request.session.userId,
        request.body.animalId,
      );
      return reply.send({ favorited });
    }),
  }),
});
