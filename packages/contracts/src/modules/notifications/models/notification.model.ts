import { z } from "zod";

export const notificationModel = z.object({
  id: z.number(),
  orgId: z.number().nullable(),
  type: z.string(),
  title: z.string(),
  message: z.string().nullable(),
  link: z.string().nullable(),
  isRead: z.boolean(),
  createdAt: z.string(),
});
export type Notification = z.infer<typeof notificationModel>;
