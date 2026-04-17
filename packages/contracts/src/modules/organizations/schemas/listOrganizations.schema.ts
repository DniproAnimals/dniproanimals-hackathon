import { z } from "zod";
import { organizationModel } from "../models";

export const listOrganizationsResponseSchema = z.array(organizationModel);
export type ListOrganizationsResponse = z.infer<
  typeof listOrganizationsResponseSchema
>;
