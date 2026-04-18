import type { FastifyZodInstance } from "../../shared/types/fastify";
import { volunteersController } from "./volunteers.controller";

export function registerVolunteersRoutes(app: FastifyZodInstance) {
  app.route(volunteersController.inviteInfo);
  app.route(volunteersController.acceptInvite);
  app.route(volunteersController.list);
  app.route(volunteersController.stats);
  app.route(volunteersController.create);
  app.route(volunteersController.update);
  app.route(volunteersController.delete);
}
