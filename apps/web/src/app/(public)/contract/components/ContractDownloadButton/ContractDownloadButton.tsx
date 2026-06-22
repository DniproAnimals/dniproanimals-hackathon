"use client";

import { IconDownload } from "@dniproanimals/icons";
import { Button } from "@dniproanimals/ui";
import { useState } from "react";
import { downloadContractPdf } from "../../utils/download-contract-pdf";

export function ContractDownloadButton() {
  const [isGenerating, setIsGenerating] = useState(false);

  async function handleDownload() {
    setIsGenerating(true);
    try {
      await downloadContractPdf();
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
