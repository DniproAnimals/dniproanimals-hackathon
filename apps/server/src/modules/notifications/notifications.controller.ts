import { listNotificationsResponseSchema } from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
import { ForbiddenError } from "../../shared/errors";
import { createController, defineRoute } from "../../shared/types/controller";
import { toNotificationResponse } from "../../shared/utils/serializers";
import { withAuth } from "../auth/auth.guard";
import { usersService } from "../users/users.service";
import { notificationsService } from "./notifications.service";

export const notificationsController = createController({
  list: defineRoute({
    method: "GET",
    url: endpoints.notifications.list(),
    schema: {
      response: { 200: listNotificationsResponseSchema },
    },
    handler: withAuth(async (request, reply) => {
      const user = await usersService.getById(request.session.userId);
      if (!user || user.role === "user") throw new ForbiddenError();
      const rows = await notificationsService.list();
      return reply.send(rows.map(toNotificationResponse));
    }),
  }),
});
