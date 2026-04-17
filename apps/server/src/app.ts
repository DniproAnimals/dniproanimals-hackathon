import { env } from "@dniproanimals/env";
import fastifyCookie from "@fastify/cookie";
import fastifyMultipart from "@fastify/multipart";
import fastify from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { appRouter } from "./modules";
import { registerCors } from "./shared/plugins/cors";
import { registerSession } from "./shared/plugins/session";
import { registerZod } from "./shared/plugins/zod";

export const startServer = async () => {
  const server = fastify({
    logger: env.NODE_ENV === "development",
  }).withTypeProvider<ZodTypeProvider>();

  await registerCors(server);
  await registerZod(server);
  await server.register(fastifyCookie);
  await registerSession(server);
  await server.register(fastifyMultipart, {
    attachFieldsToBody: true,
    limits: { fileSize: 50 * 1024 * 1024 },
  });
  await server.register(appRouter);

  await server.listen({ port: env.SERVER_PORT });
  console.log(`Fastify server running on http://localhost:${env.SERVER_PORT}`);
};
