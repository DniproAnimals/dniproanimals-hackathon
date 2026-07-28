"use client";

import { useDownloadContractMutation } from "@/shared/query-hooks/mutations/useDownloadContractMutation";
import { IconDownload } from "@dniproanimals/icons";
import { Button } from "@dniproanimals/ui";

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
  const { mutateAsync, isPending } = useDownloadContractMutation();

  async function handleDownload() {
    try {
      const blob = await mutateAsync(contractId);

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = getDownloadFilename(contractId);
      link.rel = "noopener";

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);

      window.alert(
        "Не вдалося створити PDF. Спробуйте ще раз або оновіть сторінку.",
      );
    }
  }

  return (
    <Button
      type="button"
      variant="primary"
      size="lg"
      shape="pill"
      disabled={isPending}
      onClick={handleDownload}
    >
      <IconDownload size={18} />
      {isPending ? "Готуємо PDF…" : "Завантажити PDF"}
    </Button>
  );
}
