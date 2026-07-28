"use client";

import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import { useDownloadContractMutation } from "@/shared/query-hooks/mutations/useDownloadContractMutation";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type Props = {
  contractId: string;
};

// Совпадает с полями страницы в contractTemplatePdfService (Puppeteer page.pdf()):
// margin.top = 20mm, margin.bottom = 20mm. Если поменяете значения там — поменяйте и тут.
const PAGE_WIDTH_PX = 794; // ~210mm при текущем масштабе рендера
const PX_PER_MM = PAGE_WIDTH_PX / 210;
const PAGE_MARGIN_TOP_MM = 20;
const PAGE_MARGIN_BOTTOM_MM = 20;
const PAGE_OVERLAP_PX = Math.round(
  (PAGE_MARGIN_TOP_MM + PAGE_MARGIN_BOTTOM_MM) * PX_PER_MM,
); // ≈151px — суммарный "пустой" зазор между соседними страницами

export function ContractPdfViewer({ contractId }: Props) {
  const { mutateAsync } = useDownloadContractMutation();

  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let objectUrl: string | null = null;

    mutateAsync(contractId)
      .then((blob) => {
        objectUrl = URL.createObjectURL(blob);
        setFileUrl(objectUrl);
      })
      .catch(() => setHasError(true));

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractId]);

  if (hasError) {
    return <div>Не вдалося завантажити PDF.</div>;
  }

  if (!fileUrl) {
    return <div>Завантаження PDF...</div>;
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center">
      <Document
        file={fileUrl}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
      >
        {Array.from({ length: numPages }, (_, i) => (
          <div
            key={i}
            style={i > 0 ? { marginTop: -PAGE_OVERLAP_PX } : undefined}
          >
            <Page
              pageNumber={i + 1}
              width={PAGE_WIDTH_PX}
              className="shadow-xl"
              loading={
                <div
                  className="bg-white shadow-xl"
                  style={{ width: PAGE_WIDTH_PX, height: 1123 }}
                />
              }
            />
          </div>
        ))}
      </Document>
    </div>
  );
}
