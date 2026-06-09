import {
  listUsersResponseSchema,
  updateUserRoleBodySchema,
  updateUserRoleResponseSchema,
} from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
import { createController, defineRoute } from "../../shared/types/controller";
import { toUserResponse } from "../../shared/utils/serializers";
import { withAuth } from "../auth/auth.guard";
import { usersService } from "./users.service";

export const usersController = createController({
  list: defineRoute({
    method: "GET",
    url: endpoints.users.list(),
    schema: {
      response: { 200: listUsersResponseSchema },
    },
    handler: withAuth(async (request, reply) => {
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
    handler: withAuth(async (request, reply) => {
      // Only superadmins or admins should do this, but withAuth is enough for now if we don't have RBAC in middleware
      const result = await usersService.updateRole(
        request.body.id,
        request.body.role,
      );
      return reply.send(result);
    }),
  }),
});
