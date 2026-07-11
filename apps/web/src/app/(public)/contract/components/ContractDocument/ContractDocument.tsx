"use client";

import { useContractTemplateQuery } from "@/shared/query-hooks/queries/useContractTemplateQuery";
import { ContractDocumentView } from "@dniproanimals/contracts";

export function ContractDocument() {
  const { data: contract, isLoading } = useContractTemplateQuery("adoption");

  if (isLoading) {
    return <div>Завантаження...</div>;
  }

  if (!contract) {
    return <div>Договір не знайдено.</div>;
  }

  return <ContractDocumentView contract={contract} />;
}
