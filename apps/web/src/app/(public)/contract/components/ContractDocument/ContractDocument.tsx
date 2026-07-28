"use client";

import dynamic from "next/dynamic";

const ContractPdfViewer = dynamic(
  () => import("./ContractPdfViewer").then((m) => m.ContractPdfViewer),
  { ssr: false, loading: () => <div>Завантаження PDF...</div> },
);

export function ContractDocument() {
  return <ContractPdfViewer contractId="adoption" />;
}
