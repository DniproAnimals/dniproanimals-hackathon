import type { FastifyZodInstance } from "../../shared/types/fastify";
import { contractTemplateController } from "./contract-template.controller";

export function registerContractTemplateRoutes(app: FastifyZodInstance) {
  app.route(contractTemplateController.get);
  app.route(contractTemplateController.pdf);
  app.route(contractTemplateController.update);
}
