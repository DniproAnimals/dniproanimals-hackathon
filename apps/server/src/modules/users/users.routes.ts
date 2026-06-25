import type { FastifyZodInstance } from "../../shared/types/fastify";
import { usersController } from "./users.controller";

export function registerUsersRoutes(app: FastifyZodInstance) {
  app.route(usersController.list);
  app.route(usersController.updateRole);
}
