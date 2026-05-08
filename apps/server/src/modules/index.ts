import type { FastifyZodInstance } from "../shared/types/fastify";
import { registerAdoptionRoutes } from "./adoption";
import { registerAnimalsRoutes } from "./animals";
import { registerAuthRoutes } from "./auth";
import { registerFavoritesRoutes } from "./favorites";
import { registerFoundationRoutes } from "./foundation";
import { registerNotificationsRoutes } from "./notifications";
import { registerUsersRoutes } from "./users";

export async function appRouter(fastify: FastifyZodInstance) {
  registerAuthRoutes(fastify);
  registerAnimalsRoutes(fastify);
  registerAdoptionRoutes(fastify);
  registerFavoritesRoutes(fastify);
  registerNotificationsRoutes(fastify);
  registerFoundationRoutes(fastify);
  registerUsersRoutes(fastify);
}
