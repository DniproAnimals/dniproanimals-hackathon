import { z } from "zod";

export const successSchema = z.object({ success: z.boolean() });
export type Success = z.infer<typeof successSchema>;
