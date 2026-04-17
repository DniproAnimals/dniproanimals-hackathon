import type { FastifyZodInstance } from "../../shared/types/fastify";
import { lostController } from "./lost.controller";

export function registerLostRoutes(app: FastifyZodInstance) {
  app.route(lostController.list);
  app.route(lostController.create);
  app.route(lostController.update);
}
