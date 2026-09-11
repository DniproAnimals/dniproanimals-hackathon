import { env } from "@dniproanimals/env";
import fastifySession from "@fastify/session";
import { RedisStore } from "connect-redis";
import { redis } from "../lib/redis";
import type { FastifyZodInstance } from "../types/fastify";

export async function registerSession(app: FastifyZodInstance) {
  const isProduction = env.NODE_ENV === "production";

  await app.register(fastifySession, {
    secret: env.SESSION_SECRET,
    store: new RedisStore({ client: redis }),
    cookieName: "session",
    cookie: {
      secure: isProduction,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      sameSite: isProduction ? "none" : "lax",
    },
    saveUninitialized: false,
  });
}
