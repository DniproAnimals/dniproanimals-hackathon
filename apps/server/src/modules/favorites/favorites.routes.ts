import type { FastifyZodInstance } from "../../shared/types/fastify";
import { favoritesController } from "./favorites.controller";

export function registerFavoritesRoutes(app: FastifyZodInstance) {
  app.route(favoritesController.list);
  app.route(favoritesController.toggle);
}
