"use client";
import { Dialog, type DialogProps } from "@dniproanimals/ui";
import { useState } from "react";
import { AdoptionForm } from "./components/AdoptionForm";
import { AdoptionSuccess } from "./components/AdoptionSuccess";

interface AdoptionFlowProps extends Omit<DialogProps, "children"> {
  animalId: number;
  onClose: () => void;
}

export function AdoptionFlow({ open, animalId, onClose }: AdoptionFlowProps) {
  const [submitted, setSubmitted] = useState(false);
  const [prevOpen, setPrevOpen] = useState(open);

  if (prevOpen !== open) {
    setPrevOpen(open);
    if (!open) setSubmitted(false);
  }

  return (
    <>
      <Dialog open={!!open && !submitted} onOpenChange={(o) => !o && onClose()}>
        {open && !submitted && (
          <AdoptionForm
            animalId={animalId}
            onSuccess={() => setSubmitted(true)}
          />
        )}
      </Dialog>

      <Dialog open={submitted} onOpenChange={(o) => !o && onClose()}>
        {submitted && <AdoptionSuccess onClose={onClose} />}
      </Dialog>
    </>
  );
}
