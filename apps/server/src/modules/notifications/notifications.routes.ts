import type { FastifyZodInstance } from "../../shared/types/fastify";
import { notificationsController } from "./notifications.controller";

export function registerNotificationsRoutes(app: FastifyZodInstance) {
  app.route(notificationsController.list);
}
