import {
  listUsersResponseSchema,
  updateUserRoleBodySchema,
  updateUserRoleResponseSchema,
} from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
import { ForbiddenError, NotFoundError } from "../../shared/errors";
import { createController, defineRoute } from "../../shared/types/controller";
import { toUserResponse } from "../../shared/utils/serializers";
import { withSuperadminRole } from "../auth/auth.guard";
import { usersService } from "./users.service";

export const usersController = createController({
  list: defineRoute({
    method: "GET",
    url: endpoints.users.list(),
    schema: {
      response: { 200: listUsersResponseSchema },
    },
    handler: withSuperadminRole(async (request, reply) => {
      const users = await usersService.list();
      return reply.send(users.map(toUserResponse));
    }),
  }),

  updateRole: defineRoute({
    method: "PATCH",
    url: endpoints.users.updateRole(),
    schema: {
      body: updateUserRoleBodySchema,
      response: { 200: updateUserRoleResponseSchema },
    },
    handler: withSuperadminRole(async (request, reply) => {
      if (request.body.id === request.session.userId) {
        throw new ForbiddenError();
      }

      const user = await usersService.getById(request.body.id);
      if (!user) throw new NotFoundError("User");
      if (user.role === "superadmin") throw new ForbiddenError();

      const result = await usersService.updateRole(
        request.body.id,
        request.body.role,
      );
      return reply.send(result);
    }),
  }),
});
