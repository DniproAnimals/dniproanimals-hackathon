import {
  googleLoginBodySchema,
  loginBodySchema,
  logoutResponseSchema,
  registerBodySchema,
  resendEmailResponseSchema,
  resendEmailSchema,
  userModel,
  verifyEmailQuerySchema,
  verifyEmailResponseSchema,
} from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  TooManyRequestsError,
  UnauthorizedError,
} from "../../shared/errors";
import { createController, defineRoute } from "../../shared/types/controller";
import { toUserResponse } from "../../shared/utils/serializers";
import { withAuth } from "./auth.guard";
import { authService } from "./auth.service";

export const authController = createController({
  register: defineRoute({
    method: "POST",
    url: endpoints.auth.register(),
    schema: {
      body: registerBodySchema,
      response: { 200: userModel },
    },
    handler: async (request, reply) => {
      const user = await authService.register(request.body);
      if (!user) throw new ConflictError("User with this email already exists");
      return reply.send(toUserResponse(user));
    },
  }),

  login: defineRoute({
    method: "POST",
    url: endpoints.auth.login(),
    schema: {
      body: loginBodySchema,
      response: { 200: userModel },
    },
    handler: async (request, reply) => {
      const user = await authService.login(request.body);
      if (!user) throw new UnauthorizedError();
      request.session.userId = user.id;
      return reply.send(toUserResponse(user));
    },
  }),

  googleLogin: defineRoute({
    method: "POST",
    url: endpoints.auth.google(),
    schema: {
      body: googleLoginBodySchema,
      response: { 200: userModel },
    },
    handler: async (request, reply) => {
      const user = await authService.loginWithGoogleIdToken(
        request.body.idToken,
      );
      if (!user) throw new UnauthorizedError();
      request.session.userId = user.id;
      return reply.send(toUserResponse(user));
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

  verifyEmail: defineRoute({
    method: "GET",
    url: endpoints.auth.verifyEmail(),
    schema: {
      querystring: verifyEmailQuerySchema,
      response: { 200: verifyEmailResponseSchema },
    },
    handler: async (request, reply) => {
      const result = await authService.verifyEmail(request.query.token);
      if (!result.ok) {
        if (result.reason === "expired") {
          throw new BadRequestError("Verification link expired");
        }
        if (result.reason === "used") {
          throw new BadRequestError("Verification link already used");
        }
        throw new NotFoundError("Verification token");
      }
      return reply.send({ success: true });
    },
  }),

  me: defineRoute({
    method: "GET",
    url: endpoints.auth.me(),
    schema: {
      response: { 200: userModel },
    },
    handler: withAuth(async (request, reply) => {
      const user = await authService.getById(request.session.userId);
      if (!user) throw new NotFoundError("User");
      return reply.send(toUserResponse(user));
    }),
  }),

  resend: defineRoute({
    method: "POST",
    url: endpoints.auth.resendEmail(),
    schema: {
      body: resendEmailSchema,
      response: { 200: resendEmailResponseSchema },
    },
    handler: async (request, reply) => {
      const result = await authService.resendVerificationEmail(
        request.body.email,
      );
      if (!result.ok && result.reason === "rate-limit")
        throw new TooManyRequestsError("Rate limit exceeded");
      return reply.send({ success: true });
    },
  }),
});
