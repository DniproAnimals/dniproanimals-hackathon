import { UnauthorizedError } from "../../shared/errors";
import { createGuard } from "../../shared/utils/createGuard";

export const withAuth = createGuard(async (request, reply) => {
  if (!request.session.userId) {
    await request.session.destroy();
    reply.clearCookie("session");
    throw new UnauthorizedError();
  }
});
