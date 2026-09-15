import { db, eq, type UserRole, usersTable } from "@dniproanimals/database";
import { ForbiddenError, UnauthorizedError } from "../../shared/errors";
import { createGuard } from "../../shared/utils/createGuard";

export const withAuth = createGuard(async (request, reply) => {
  if (!request.session.userId) {
    await request.session.destroy();
    reply.clearCookie("session");
    throw new UnauthorizedError();
  }
});

const dashboardRoles: ReadonlySet<UserRole> = new Set([
  "admin",
  "superadmin",
  "volunteer",
]);

export const withDashboardRole = createGuard(async (request, reply) => {
  const userId = request.session.userId;
  if (!userId) {
    await request.session.destroy();
    reply.clearCookie("session");
    throw new UnauthorizedError();
  }

  const [user] = await db
    .select({ role: usersTable.role })
    .from(usersTable)
    .where(eq(usersTable.id, userId))
    .limit(1);

  if (!user) {
    await request.session.destroy();
    reply.clearCookie("session");
    throw new UnauthorizedError();
  }

  if (!dashboardRoles.has(user.role)) throw new ForbiddenError();
});
