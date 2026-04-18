"use client";
import { IconCheck, IconCopy } from "@dniproanimals/icons";
import { Button } from "@dniproanimals/ui";
import { useState } from "react";

interface CopyLinkButtonProps {
  text: string;
}

export function CopyLinkButton({ text }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <Button variant="secondary" size="lg" onClick={copy} className="shrink-0">
      {copied ? (
        <>
          <IconCheck size={14} /> Скопійовано
        </>
      ) : (
        <>
          <IconCopy size={14} /> Копіювати
        </>
      )}
    </Button>
  );
}
