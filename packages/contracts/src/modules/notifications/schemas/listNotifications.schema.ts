import { z } from "zod";
import { notificationModel } from "../models";

export const listNotificationsResponseSchema = z.array(notificationModel);
export type ListNotificationsResponse = z.infer<
  typeof listNotificationsResponseSchema
>;
