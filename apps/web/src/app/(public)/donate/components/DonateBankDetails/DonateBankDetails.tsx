import { IconCreditCard } from "@dniproanimals/icons";
import { Card } from "@dniproanimals/ui";

const BANK_ACCOUNTS = [
  { label: "Monobank", number: "4441 1144 4172 7326" },
  { label: "ПриватБанк", number: "5168 7456 0790 6259" },
];

export function DonateBankDetails() {
  return (
    <Card className="p-8 rounded-3xl border-gray-100 shadow-sm mb-8">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
        <IconCreditCard size={24} />
        Прямі банківські реквізити
      </h2>
      <div className="grid md:grid-cols-2 gap-4">
        {BANK_ACCOUNTS.map((account) => (
          <div key={account.label} className="bg-gray-50 p-4 rounded-2xl">
            <p className="text-xs text-gray-500 uppercase font-bold mb-1">
              {account.label}
            </p>
            <p className="text-xl font-mono font-bold text-green-secondary">
              {account.number}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
