"use client";

import { useBankDetailsQuery } from "@/shared/query-hooks";
import { IconCreditCard } from "@dniproanimals/icons";
import { Button, Card } from "@dniproanimals/ui";
import { useState } from "react";

export function CorrespondentBanks() {
  const { data: bankDetails } = useBankDetailsQuery();
  const banks = bankDetails?.correspondentBanks ?? [];
  const [selectedBankIndex, setSelectedBankIndex] = useState(0);

  if (banks.length === 0) return null;

  const selectedBank = banks[selectedBankIndex];

  const copyToClipboard = (value: string) => {
    void navigator.clipboard.writeText(value);
  };

  const details = [
    {
      label: "Рахунок",
      value: selectedBank?.account ?? "",
    },
    {
      label: "SWIFT",
      value: selectedBank?.swiftCode ?? "",
    },
    {
      label: "Банк",
      value: selectedBank?.bankName ?? "",
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
        borderTop: `6px solid ${selectedBank?.color || "#7c4b22"}`,
      }}
    >
      <h2 className="mb-5 flex items-start gap-3 text-lg font-bold sm:mb-6 sm:text-xl">
        <IconCreditCard size={24} className="mt-0.5 shrink-0" />

        <span className="min-w-0">Банки-кореспонденти</span>
      </h2>

      <div className="flex min-w-0 flex-col gap-4">
        {/* Bank selector */}
        <div className="flex min-w-0 flex-wrap gap-2">
          {banks.map((bank, index) => {
            const isSelected = index === selectedBankIndex;

            return (
              <Button
                key={`${bank.account}-${bank.swiftCode}`}
                type="button"
                variant="outline"
                className={`max-w-full min-w-0 truncate border-brown text-sm text-brown hover:border-brown hover:bg-brown hover:text-white sm:text-base ${
                  isSelected ? "bg-brown text-white" : ""
                }`}
                style={{
                  borderColor: bank.color || "#7c4b22",
                }}
                title={bank.bankName}
                onClick={() => setSelectedBankIndex(index)}
              >
                <span className="block max-w-55 truncate sm:max-w-70">
                  {bank.bankName.split(",")[0]}
                </span>
              </Button>
            );
          })}
        </div>

        {/* Bank details */}
        <div className="flex min-w-0 flex-col gap-3 rounded-2xl bg-gray-50 p-3 sm:p-4">
          {details.map((detail) => (
            <div key={detail.label} className="min-w-0">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-gray-500 sm:text-xs">
                {detail.label}
              </p>

              <button
                type="button"
                title="Натисніть, щоб скопіювати"
                onClick={() => copyToClipboard(detail.value)}
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
                <span className="block wrap-break-words">{detail.value}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
