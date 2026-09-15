import { z } from "zod";

const correspondentBankSchema = z.object({
  account: z.string(),
  swiftCode: z.string(),
  bankName: z.string(),
  color: z.string().optional(),
});

export const bankDetailsSchema = z.object({
  id: z.number(),
  directBankDetails: z.object({
    title: z.string(),
    color: z.string().optional(),
    recipientName: z.string(),
    recipientCode: z.string(),
    recipientAccount: z.string(),
    bankName: z.string(),
    paymentPurpose: z.string(),
  }),
  foreignCurrencyAccount: z.object({
    title: z.string(),
    color: z.string().optional(),
    companyName: z.string(),
    iban: z.string(),
    bankName: z.string(),
    bankSwiftCode: z.string(),
    companyAddress: z.string(),
  }),
  correspondentBanks: z.array(correspondentBankSchema),
  updatedAt: z.date(),
});

export type BankDetails = z.infer<typeof bankDetailsSchema>;

export const updateBankDetailsBodySchema = bankDetailsSchema.omit({
  id: true,
  updatedAt: true,
});

export type UpdateBankDetailsBody = z.infer<typeof updateBankDetailsBodySchema>;

export const updateBankDetailsResponseSchema = z.object({
  success: z.boolean(),
});

export type UpdateBankDetailsResponse = z.infer<
  typeof updateBankDetailsResponseSchema
>;
