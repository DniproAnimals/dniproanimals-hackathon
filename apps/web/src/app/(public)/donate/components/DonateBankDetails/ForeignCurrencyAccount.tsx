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
    {
      label: "Отримувач",
      value: details.companyName,
    },
    {
      label: "IBAN",
      value: details.iban,
    },
    {
      label: "Банк",
      value: details.bankName,
    },
    {
      label: "SWIFT",
      value: details.bankSwiftCode,
    },
    {
      label: "Адреса",
      value: details.companyAddress,
    },
  ];

  return (
    <Card
      className="
        relative
        w-full
        max-w-full
        overflow-hidden
        rounded-3xl
        border-gray-100
        p-4
        shadow-sm
        sm:p-6
        lg:p-8
      "
      style={{
        borderTop: `6px solid ${details.color || "#5b7765"}`,
      }}
    >
      <h2 className="mb-5 flex items-start gap-3 text-lg font-bold sm:mb-6 sm:text-xl">
        <IconCreditCard size={24} className="mt-0.5 shrink-0" />

        <span className="min-w-0 wrap-break-words">{details.title}</span>
      </h2>

      <div className="flex min-w-0 flex-col gap-3">
        {accounts.map((account) => (
          <div
            key={account.label}
            className="min-w-0 rounded-2xl bg-gray-50 p-3 sm:p-4"
          >
            <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-gray-500 sm:text-xs">
              {account.label}
            </p>

            <button
              type="button"
              title="Натисніть, щоб скопіювати"
              onClick={() => copyToClipboard(account.value)}
              className="
                block
                w-full
                min-w-0
                cursor-pointer
                text-left
                font-mono
                text-sm
                font-bold
                leading-relaxed
                text-green-secondary
                transition-opacity
                hover:opacity-70
                sm:text-base
                lg:text-lg
              "
            >
              <span className="block wrap-break-words">{account.value}</span>
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
}
