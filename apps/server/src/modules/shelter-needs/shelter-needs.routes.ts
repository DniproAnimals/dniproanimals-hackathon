import type { FastifyZodInstance } from "../../shared/types/fastify";
import { shelterNeedsController } from "./shelter-needs.controller";

export function registerShelterNeedsRoutes(app: FastifyZodInstance) {
  app.route(shelterNeedsController.get);
  app.route(shelterNeedsController.update);
}
