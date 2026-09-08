import type { FastifyZodInstance } from "../../shared/types/fastify";
import { bankDetailsController } from "./bank-details.controller";

export function registerBankDetailsRoutes(app: FastifyZodInstance) {
  app.route(bankDetailsController.get);
}
