import type { FastifyZodInstance } from "../../shared/types/fastify";
import { foundationController } from "./foundation.controller";

export function registerFoundationRoutes(app: FastifyZodInstance) {
  app.route(foundationController.get);
  app.route(foundationController.update);
}
