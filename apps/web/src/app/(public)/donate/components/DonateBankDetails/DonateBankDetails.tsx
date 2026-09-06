"use client";

import { IconCreditCard } from "@dniproanimals/icons";
import { Card } from "@dniproanimals/ui";

export function DonateBankDetails() {
  return (
    <Card className="p-8 rounded-3xl border-gray-100 shadow-sm mb-8">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
        <IconCreditCard size={24} />
        Прямі банківські реквізити
      </h2>
      <div className="grid md:grid-cols-2 gap-4"></div>
    </Card>
  );
}
