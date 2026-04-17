import { env } from "@dniproanimals/env";
import fastifySession from "@fastify/session";
import { RedisStore } from "connect-redis";
import { redis } from "../lib/redis";
import type { FastifyZodInstance } from "../types/fastify";

export async function registerSession(app: FastifyZodInstance) {
  await app.register(fastifySession, {
    secret: env.SESSION_SECRET,
    store: new RedisStore({ client: redis }),
    cookieName: "session",
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      sameSite: "lax",
    },
    saveUninitialized: false,
  });
}
