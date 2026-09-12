import { env } from "@dniproanimals/env";
import fastifySession from "@fastify/session";
import { RedisStore } from "connect-redis";
import { redis } from "../lib/redis";
import type { FastifyZodInstance } from "../types/fastify";

export const sessionCookieOptions = {
  secure: env.NODE_ENV === "production",
  httpOnly: true,
  sameSite: env.NODE_ENV === "production" ? "none" : "lax",
  path: "/",
} as const;

export async function registerSession(app: FastifyZodInstance) {
  await app.register(fastifySession, {
    secret: env.SESSION_SECRET,
    store: new RedisStore({ client: redis }),
    cookieName: "session",
    cookie: {
      ...sessionCookieOptions,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
    saveUninitialized: false,
  });
}
