import { acceptInviteBodySchema } from "@dniproanimals/contracts";
import { z } from "zod";

export const acceptInviteFormSchema = acceptInviteBodySchema.pick({
  email: true,
  password: true,
});

export type AcceptInviteFormValues = z.infer<typeof acceptInviteFormSchema>;

export const ACCEPT_INVITE_FORM_DEFAULTS: AcceptInviteFormValues = {
  email: "",
  password: "",
};
