import { z } from "zod";

const correspondentBankSchema = z.object({
  account: z.string(),
  swiftCode: z.string(),
  bankName: z.string(),
});

export const bankDetailsSchema = z.object({
  id: z.number(),
  directBankDetails: z.object({
    title: z.string(),
    recipientName: z.string(),
    recipientCode: z.string(),
    recipientAccount: z.string(),
    bankName: z.string(),
    paymentPurpose: z.string(),
  }),
  foreignCurrencyAccount: z.object({
    title: z.string(),
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
