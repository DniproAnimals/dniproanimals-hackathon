import type { FastifyZodInstance } from "../shared/types/fastify";
import { registerAdoptionRoutes } from "./adoption";
import { registerAnimalsRoutes } from "./animals";
import { registerAuthRoutes } from "./auth";
import { registerFavoritesRoutes } from "./favorites";
import { registerLostRoutes } from "./lost";
import { registerNotificationsRoutes } from "./notifications";
import { registerOrganizationsRoutes } from "./organizations";
import { registerSuperadminRoutes } from "./superadmin";
import { registerUploadRoutes } from "./upload";
import { registerVolunteersRoutes } from "./volunteers";

export async function appRouter(fastify: FastifyZodInstance) {
  registerAuthRoutes(fastify);
  registerAnimalsRoutes(fastify);
  registerOrganizationsRoutes(fastify);
  registerAdoptionRoutes(fastify);
  registerLostRoutes(fastify);
  registerFavoritesRoutes(fastify);
  registerVolunteersRoutes(fastify);
  registerNotificationsRoutes(fastify);
  registerSuperadminRoutes(fastify);
  registerUploadRoutes(fastify);
}
