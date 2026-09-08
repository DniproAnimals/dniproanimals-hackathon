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

  const copyToClipboard = (value: string) => {
    void navigator.clipboard.writeText(value);
  };

  return (
    <Card
      className="
        relative
        w-1/2
        max-w-full
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
        before:w-1.5        before:bg-[#7C4B22]
        before:content-['']
      "
    >
      <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
        <IconCreditCard size={24} />
        Банки-кореспонденти
      </h2>
      <div className="flex flex-col gap-4">
        <div className="flex flex-row flex-wrap gap-2">
          {banks.map((bank, index) => (
            <Button
              key={`${bank.account}-${bank.swiftCode}`}
              type="button"
              variant="outline"
              className={`w-fit max-w-full truncate border-brown text-brown hover:border-brown hover:bg-brown hover:text-white ${
                index === selectedBankIndex ? "bg-brown text-white" : ""
              }`}
              title={bank.bankName}
              onClick={() => setSelectedBankIndex(index)}
            >
              {bank.bankName.split(",")[0]}
            </Button>
          ))}
        </div>
        <div className="bg-gray-50 rounded-2xl">
          <p className="text-xs text-gray-500 uppercase font-bold mb-1">
            Рахунок
          </p>
          <li
            className="text-xl ml-6 font-mono font-bold text-green-secondary cursor-pointer"
            title="Нажмите, чтобы скопировать"
            onClick={() =>
              copyToClipboard(banks[selectedBankIndex]?.account ?? "")
            }
          >
            {banks[selectedBankIndex]?.account}
          </li>
          <p className="text-xs text-gray-500 uppercase font-bold mb-1">
            SWIFT
          </p>
          <li
            className="text-xl ml-6 font-mono font-bold text-green-secondary cursor-pointer"
            title="Нажмите, чтобы скопировать"
            onClick={() =>
              copyToClipboard(banks[selectedBankIndex]?.swiftCode ?? "")
            }
          >
            {banks[selectedBankIndex]?.swiftCode}
          </li>
          <p className="text-xs text-gray-500 uppercase font-bold mb-1">Банк</p>
          <li
            className="text-xl ml-6 font-mono font-bold text-green-secondary cursor-pointer"
            title="Нажмите, чтобы скопировать"
            onClick={() =>
              copyToClipboard(banks[selectedBankIndex]?.bankName ?? "")
            }
          >
            {banks[selectedBankIndex]?.bankName}
          </li>
        </div>
      </div>
    </Card>
  );
}
