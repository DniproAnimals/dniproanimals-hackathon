import type { FastifyZodInstance } from "../../shared/types/fastify";
import { authController } from "./auth.controller";

export function registerAuthRoutes(app: FastifyZodInstance) {
  app.route(authController.register);
  app.route(authController.login);
  app.route(authController.googleLogin);
  app.route(authController.logout);
  app.route(authController.verifyEmail);
  app.route(authController.me);
}
