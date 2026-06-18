import { createError } from "@fastify/error";

export const UnauthorizedError = createError(
  "UNAUTHORIZED",
  "Unauthorized",
  401,
);

export const ForbiddenError = createError("FORBIDDEN", "Forbidden", 403);

export const NotFoundError = createError("NOT_FOUND", "%s not found", 404);

export const BadRequestError = createError("BAD_REQUEST", "%s", 400);

export const ConflictError = createError("CONFLICT", "%s", 409);

export const TooManyRequestsError = createError("TOO_MANY_REQUESTS", "%s", 429);
