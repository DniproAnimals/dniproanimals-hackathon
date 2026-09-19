import { listNotificationsResponseSchema } from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
import { createController, defineRoute } from "../../shared/types/controller";
import { toNotificationResponse } from "../../shared/utils/serializers";
import { withDashboardRole } from "../auth/auth.guard";
import { notificationsService } from "./notifications.service";

export const notificationsController = createController({
  list: defineRoute({
    method: "GET",
    url: endpoints.notifications.list(),
    schema: {
      response: { 200: listNotificationsResponseSchema },
    },
    handler: withDashboardRole(async (_request, reply) => {
      const rows = await notificationsService.list();
      return reply.send(rows.map(toNotificationResponse));
    }),
  }),
});
