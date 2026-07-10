"use client";

import { IconDownload } from "@dniproanimals/icons";
import { Button } from "@dniproanimals/ui";
import { useState } from "react";

type ContractDownloadButtonProps = {
  contractId: string;
};

function getDownloadFilename(contractId: string): string {
  const safeId = contractId.trim().replace(/[^a-z0-9_-]+/gi, "-");
  return `dogovir-${safeId || "contract"}.pdf`;
}

export function ContractDownloadButton({
  contractId,
}: ContractDownloadButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  async function handleDownload() {
    setIsGenerating(true);
    try {
      const response = await fetch(`/api/contracts/${contractId}/pdf`);

      if (!response.ok) {
        throw new Error(`PDF request failed with status ${response.status}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const downloadLink = document.createElement("a");
      downloadLink.href = url;
      downloadLink.download = getDownloadFilename(contractId);
      downloadLink.rel = "noopener";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();
      URL.revokeObjectURL(url);
    } catch {
      window.alert(
        "Не вдалося створити PDF. Спробуйте ще раз або оновіть сторінку.",
      );
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <Button
      type="button"
      variant="primary"
      size="lg"
      shape="pill"
      disabled={isGenerating}
      onClick={handleDownload}
    >
      <IconDownload size={18} />
      {isGenerating ? "Готуємо PDF…" : "Завантажити PDF"}
    </Button>
  );
}
