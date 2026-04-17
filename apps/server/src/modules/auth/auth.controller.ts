import {
  authUserResponseSchema,
  loginBodySchema,
  logoutResponseSchema,
  registerBodySchema,
} from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../../shared/errors";
import { createController, defineRoute } from "../../shared/types/controller";
import { withAuth } from "./auth.guard";
import { authService } from "./auth.service";

function toResponse(user: {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin" | "volunteer" | "superadmin";
  photo: string | null;
  description: string | null;
  phone: string | null;
  instagram: string | null;
  telegram: string | null;
  facebook: string | null;
  orgId: number | null;
  createdAt: Date;
}) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    photo: user.photo,
    description: user.description,
    phone: user.phone,
    instagram: user.instagram,
    telegram: user.telegram,
    facebook: user.facebook,
    orgId: user.orgId,
    createdAt: user.createdAt.toISOString(),
  };
}

export const authController = createController({
  register: defineRoute({
    method: "POST",
    url: endpoints.auth.register(),
    schema: {
      body: registerBodySchema,
      response: { 200: authUserResponseSchema },
    },
    handler: async (request, reply) => {
      const user = await authService.register(request.body);
      if (!user) throw new ConflictError("User with this email already exists");
      request.session.userId = user.id;
      return reply.send(toResponse(user));
    },
  }),

  login: defineRoute({
    method: "POST",
    url: endpoints.auth.login(),
    schema: {
      body: loginBodySchema,
      response: { 200: authUserResponseSchema },
    },
    handler: async (request, reply) => {
      const user = await authService.login(request.body);
      if (!user) throw new UnauthorizedError();
      request.session.userId = user.id;
      return reply.send(toResponse(user));
    },
  }),

  logout: defineRoute({
    method: "POST",
    url: endpoints.auth.logout(),
    schema: {
      response: { 200: logoutResponseSchema },
    },
    handler: async (request, reply) => {
      await request.session.destroy();
      reply.clearCookie("session");
      return reply.send({ success: true });
    },
  }),

  me: defineRoute({
    method: "GET",
    url: endpoints.auth.me(),
    schema: {
      response: { 200: authUserResponseSchema },
    },
    handler: withAuth(async (request, reply) => {
      const user = await authService.getById(request.session.userId);
      if (!user) throw new NotFoundError("User");
      return reply.send(toResponse(user));
    }),
  }),
});
