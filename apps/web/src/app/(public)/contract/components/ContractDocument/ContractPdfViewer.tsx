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
    <div className="mx-auto flex max-w-3xl flex-col items-center gap-4">
      <Document
        file={fileUrl}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
      >
        {Array.from({ length: numPages }, (_, i) => (
          <Page
            key={i}
            pageNumber={i + 1}
            width={794}
            className="shadow-xl"
            loading={
              <div
                className="bg-white shadow-xl"
                style={{
                  width: 794,
                  height: 1123,
                }}
              />
            }
          />
        ))}
      </Document>
    </div>
  );
}
