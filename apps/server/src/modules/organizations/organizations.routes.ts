import type { FastifyZodInstance } from "../../shared/types/fastify";
import { organizationsController } from "./organizations.controller";

export function registerOrganizationsRoutes(app: FastifyZodInstance) {
  app.route(organizationsController.list);
  app.route(organizationsController.updateJar);
  app.route(organizationsController.get);
  app.route(organizationsController.animals);
  app.route(organizationsController.volunteers);
  app.route(organizationsController.create);
  app.route(organizationsController.updateStatus);
  app.route(organizationsController.updateOwn);
}
