import { z } from "zod";

export const foundationSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  address: z.string().nullable(),
  phone: z.string().nullable(),
  email: z.string().nullable(),
  instagram: z.string().nullable(),
  telegram: z.string().nullable(),
  facebook: z.string().nullable(),
  monobankJarUrl: z.string().nullable(),
  paypalEmail: z.string().nullable(),
  patreonUrl: z.string().nullable(),
  buyMeACoffeeUrl: z.string().nullable(),
  updatedAt: z.date(),
});

export type Foundation = z.infer<typeof foundationSchema>;
