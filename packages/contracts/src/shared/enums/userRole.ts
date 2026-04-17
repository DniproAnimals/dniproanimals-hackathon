import { z } from "zod";

export const userRoleSchema = z.enum([
  "user",
  "admin",
  "volunteer",
  "superadmin",
]);
export type UserRole = z.infer<typeof userRoleSchema>;
