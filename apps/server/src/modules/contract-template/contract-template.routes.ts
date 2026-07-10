import type { FastifyZodInstance } from "../../shared/types/fastify";
import { contractTemplateController } from "./contract-template.controller";

export function registerContractTemplateRoutes(app: FastifyZodInstance) {
  app.route(contractTemplateController.get);
  app.route(contractTemplateController.update);
}
