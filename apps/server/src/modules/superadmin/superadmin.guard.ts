import { ForbiddenError } from "../../shared/errors";
import { createGuard } from "../../shared/utils/createGuard";
import { usersService } from "../users/users.service";

export const withSuperadmin = createGuard(async (request) => {
  if (!request.session.userId) throw new ForbiddenError();
  const user = await usersService.getById(request.session.userId);
  if (!user || user.role !== "superadmin") throw new ForbiddenError();
});
