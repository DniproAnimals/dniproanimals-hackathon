import type { FastifyZodInstance } from "../../shared/types/fastify";
import { adoptionController } from "./adoption.controller";

export function registerAdoptionRoutes(app: FastifyZodInstance) {
  app.route(adoptionController.list);
  app.route(adoptionController.stats);
  app.route(adoptionController.create);
  app.route(adoptionController.updateStatus);
}
