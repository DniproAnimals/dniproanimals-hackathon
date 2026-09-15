import type { FastifyZodInstance } from "../../shared/types/fastify";
import { animalDonationsController } from "./animal-donations.controller";

export function registerAnimalDonationsRoutes(app: FastifyZodInstance) {
  app.route(animalDonationsController.status);
  app.route(animalDonationsController.start);
  app.route(animalDonationsController.cancel);
  app.route(animalDonationsController.supporters);
  app.route(animalDonationsController.sendUpdate);
}
