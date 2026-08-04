import type { FastifyZodInstance } from "../../shared/types/fastify";
import { animalsController } from "./animals.controller";

export function registerAnimalsRoutes(app: FastifyZodInstance) {
  app.route(animalsController.list);
  app.route(animalsController.stats);
  app.route(animalsController.get);
  app.route(animalsController.create);
  app.route(animalsController.update);
  app.route(animalsController.delete);
  app.route(animalsController.listSpecies);
  app.route(animalsController.createSpecies);
}
