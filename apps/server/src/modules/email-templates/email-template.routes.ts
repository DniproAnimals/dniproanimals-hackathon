import type { FastifyZodInstance } from "../../shared/types/fastify";
import { emailTemplateController } from "./email-template.controller";

export function registerEmailTemplateRoutes(app: FastifyZodInstance) {
  app.route(emailTemplateController.list);
  app.route(emailTemplateController.update);
}
