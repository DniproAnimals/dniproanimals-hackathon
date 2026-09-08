"use client";

import { useBankDetailsQuery } from "@/shared/query-hooks";
import { IconCreditCard } from "@dniproanimals/icons";
import { Card } from "@dniproanimals/ui";

export function ForeignCurrencyAccount() {
  const { data: bankDetails } = useBankDetailsQuery();
  const details = bankDetails?.foreignCurrencyAccount;

  if (!details) return null;

  const copyToClipboard = (value: string) => {
    void navigator.clipboard.writeText(value);
  };

  const accounts = [
    { label: "Отримувач", number: details.companyName },
    { label: "IBAN", number: details.iban },
    { label: "Банк", number: details.bankName },
    { label: "SWIFT", number: details.bankSwiftCode },
    { label: "Адреса", number: details.companyAddress },
  ];

  return (
    <Card
      className="
    relative
    w-1/2
    p-8
    rounded-3xl
    border-gray-100
    shadow-sm
    mb-8
    overflow-hidden
    before:absolute
    before:left-0
    before:top-0
    before:h-full
    before:w-1.5
    before:content-['']
  "
      style={{ borderTop: `6px solid ${details.color || "#5b7765"}` }}
    >
      <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
        <IconCreditCard size={24} />
        {details.title}
      </h2>

      <div className="flex flex-col gap-2">
        {accounts.map((account) => (
          <div key={account.label} className="bg-gray-50 rounded-2xl">
            <p className="text-xs text-gray-500 uppercase font-bold mb-1">
              {account.label}
            </p>

            <li
              className="text-xl ml-6 font-mono font-bold text-green-secondary cursor-pointer"
              title="Нажмите, чтобы скопировать"
              onClick={() => copyToClipboard(account.number)}
            >
              {account.number}
            </li>
          </div>
        ))}
      </div>
    </Card>
  );
}
