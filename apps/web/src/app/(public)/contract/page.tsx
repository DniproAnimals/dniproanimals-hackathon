import type { Metadata } from "next";
import { ContractDocument } from "./components/ContractDocument";
import { ContractDownloadButton } from "./components/ContractDownloadButton";
import { CONTRACT_ID } from "./constants/contract-content";

export const metadata: Metadata = {
  title: "Договір усиновлення — DniproAnimals",
  description:
    "Зразок договору про передачу тварини в нову сім'ю. Завантажте PDF для ознайомлення.",
};

export default function ContractPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-10 md:py-14">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Документи
            </p>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Договір
            </h1>
            <p className="mt-2 text-muted-foreground text-sm md:text-base max-w-xl">
              Ознайомтесь із зразком договору між притулком та новою
              сім&apos;єю. Текст демонстраційний — перед підписанням узгодьте
              умови з організацією.
            </p>
          </div>
          <ContractDownloadButton contractId={CONTRACT_ID} />
        </div>

        <ContractDocument />
      </div>
    </div>
  );
}
