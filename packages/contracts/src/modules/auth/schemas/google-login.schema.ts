import { z } from "zod";
import { userModel } from "../../users";

export const googleLoginBodySchema = z.object({
  idToken: z.string().min(1),
});
export type GoogleLoginBody = z.infer<typeof googleLoginBodySchema>;

export const googleLoginResponseSchema = userModel;
export type GoogleLoginResponse = z.infer<typeof googleLoginResponseSchema>;
