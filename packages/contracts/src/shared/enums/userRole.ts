import { z } from "zod";

export const userRoleSchema = z.enum(["user", "admin", "superadmin"]);
export type UserRole = z.infer<typeof userRoleSchema>;
