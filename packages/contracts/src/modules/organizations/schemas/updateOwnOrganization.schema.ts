import { z } from "zod";
import { successSchema } from "../../../shared/schemas";
import { createOrganizationBodySchema } from "./createOrganization.schema";

export const updateOwnOrganizationBodySchema = createOrganizationBodySchema;
export type UpdateOwnOrganizationBody = z.infer<
  typeof updateOwnOrganizationBodySchema
>;

export const updateOwnOrganizationResponseSchema = successSchema;
export type UpdateOwnOrganizationResponse = z.infer<
  typeof updateOwnOrganizationResponseSchema
>;
