import { z } from "zod";
import { userModel } from "./models/user.model";

export const listUsersResponseSchema = z.array(userModel);

export type ListUsersResponse = z.infer<typeof listUsersResponseSchema>;

export const updateUserRoleBodySchema = z.object({
  id: z.number(),
  role: z.enum(["user", "admin", "volunteer", "superadmin"]),
});

export type UpdateUserRoleBody = z.infer<typeof updateUserRoleBodySchema>;

export const updateUserRoleResponseSchema = z.object({
  success: z.boolean(),
});

export type UpdateUserRoleResponse = z.infer<
  typeof updateUserRoleResponseSchema
>;
