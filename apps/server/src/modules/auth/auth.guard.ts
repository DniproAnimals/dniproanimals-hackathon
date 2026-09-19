import { db, eq, type UserRole, usersTable } from "@dniproanimals/database";
import { ForbiddenError, UnauthorizedError } from "../../shared/errors";
import { sessionCookieOptions } from "../../shared/plugins/session";
import { createGuard } from "../../shared/utils/createGuard";

export const withAuth = createGuard(async (request, reply) => {
  if (!request.session.userId) {
    await request.session.destroy();
    reply.clearCookie("session", sessionCookieOptions);
    throw new UnauthorizedError();
  }
});

const dashboardRoles: ReadonlySet<UserRole> = new Set(["admin", "superadmin"]);

const superadminRoles: ReadonlySet<UserRole> = new Set(["superadmin"]);

function createRoleGuard(allowedRoles: ReadonlySet<UserRole>) {
  return createGuard(async (request, reply) => {
    const userId = request.session.userId;
    if (!userId) {
      await request.session.destroy();
      reply.clearCookie("session", sessionCookieOptions);
      throw new UnauthorizedError();
    }

    const [user] = await db
      .select({ role: usersTable.role })
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);

    if (!user) {
      await request.session.destroy();
      reply.clearCookie("session", sessionCookieOptions);
      throw new UnauthorizedError();
    }

    if (!allowedRoles.has(user.role)) throw new ForbiddenError();
  });
}

export const withDashboardRole = createRoleGuard(dashboardRoles);
export const withSuperadminRole = createRoleGuard(superadminRoles);
