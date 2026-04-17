import { z } from "zod";
import { volunteerModel } from "../models";

export const listVolunteersResponseSchema = z.array(volunteerModel);
export type ListVolunteersResponse = z.infer<
  typeof listVolunteersResponseSchema
>;
