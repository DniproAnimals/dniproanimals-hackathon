import type { FastifyZodInstance } from "../../shared/types/fastify";
import { mailController } from "./mail.controller";

export function registerMailRoutes(app: FastifyZodInstance) {
  app.route(mailController.sendTestEmail);
}
