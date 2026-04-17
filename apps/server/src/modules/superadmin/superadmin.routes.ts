import type { FastifyZodInstance } from "../../shared/types/fastify";
import { superadminController } from "./superadmin.controller";

export function registerSuperadminRoutes(app: FastifyZodInstance) {
  app.route(superadminController.updateOrg);
  app.route(superadminController.deleteOrg);
}
