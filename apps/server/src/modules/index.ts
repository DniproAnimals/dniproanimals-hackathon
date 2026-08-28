import type { FastifyZodInstance } from "../shared/types/fastify";
import { registerAdoptionRoutes } from "./adoption";
import { registerAnimalDonationsRoutes } from "./animal-donations";
import { registerAnimalsRoutes } from "./animals";
import { registerAuthRoutes } from "./auth";
import { registerContractTemplateRoutes } from "./contract-template";
import { registerFavoritesRoutes } from "./favorites";
import { registerFoundationRoutes } from "./foundation";
import { registerMailRoutes } from "./mail";
import { registerNotificationsRoutes } from "./notifications";
import { registerUploadRoutes } from "./upload";
import { registerUsersRoutes } from "./users";

export async function appRouter(fastify: FastifyZodInstance) {
  registerAuthRoutes(fastify);
  registerAnimalsRoutes(fastify);
  registerAdoptionRoutes(fastify);
  registerContractTemplateRoutes(fastify);
  registerFavoritesRoutes(fastify);
  registerMailRoutes(fastify);
  registerNotificationsRoutes(fastify);
  registerAnimalDonationsRoutes(fastify);
  registerFoundationRoutes(fastify);
  registerUploadRoutes(fastify);
  registerUsersRoutes(fastify);
}
