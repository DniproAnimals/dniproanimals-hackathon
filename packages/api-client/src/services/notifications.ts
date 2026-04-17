import type { ListNotificationsResponse } from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
import type { HttpFn } from "../createHttp";

export function createNotificationsApiService(http: HttpFn) {
  return {
    list: () =>
      http<ListNotificationsResponse>({
        endpoint: endpoints.notifications.list(),
      }),
  };
}
