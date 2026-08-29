import { z } from "zod";
import { speciesModel } from "../models/species.model";

export const listSpeciesResponseSchema = z.array(speciesModel);
export type ListSpeciesResponse = z.infer<typeof listSpeciesResponseSchema>;
