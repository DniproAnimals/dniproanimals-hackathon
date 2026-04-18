import { z } from "zod";
import { organizationModel } from "../../organizations/models";

export const superadminListOrgsResponseSchema = z.array(organizationModel);
export type SuperadminListOrgsResponse = z.infer<
  typeof superadminListOrgsResponseSchema
>;
