import { env } from "@dniproanimals/env";
import fastifyCors from "@fastify/cors";
import type { FastifyZodInstance } from "../types/fastify";

export const registerCors = async (app: FastifyZodInstance) => {
  await app.register(fastifyCors, {
    origin: env.WEB_ORIGIN,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  });
};
