import { z } from "zod";

const shelterNeedItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.string().optional(),
});

const shelterNeedSubgroupSchema = z.object({
  id: z.string(),
  title: z.string(),
  items: z.array(shelterNeedItemSchema),
});

const shelterNeedCardSchema = z.object({
  id: z.string(),
  title: z.string(),
  icon: z.string(),
  gradient: z.string(),
  color: z.string().optional(),
  variant: z.literal("default").optional(),
  items: z.array(shelterNeedItemSchema),
  subgroups: z.array(shelterNeedSubgroupSchema).optional(),
});

export const shelterNeedsSchema = z.object({
  id: z.number(),
  cards: z.array(shelterNeedCardSchema),
  updatedAt: z.date(),
});

export type ShelterNeedItem = z.infer<typeof shelterNeedItemSchema>;
export type ShelterNeedSubgroup = z.infer<typeof shelterNeedSubgroupSchema>;
export type ShelterNeedCard = z.infer<typeof shelterNeedCardSchema>;
export type ShelterNeeds = z.infer<typeof shelterNeedsSchema>;

export const updateShelterNeedsBodySchema = z.object({
  cards: z.array(shelterNeedCardSchema),
});

export type UpdateShelterNeedsBody = z.infer<
  typeof updateShelterNeedsBodySchema
>;

export const updateShelterNeedsResponseSchema = z.object({
  success: z.boolean(),
});

export type UpdateShelterNeedsResponse = z.infer<
  typeof updateShelterNeedsResponseSchema
>;
