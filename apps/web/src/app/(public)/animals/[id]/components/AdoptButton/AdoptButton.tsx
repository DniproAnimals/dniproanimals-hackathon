"use client";
import { Animal } from "@dniproanimals/contracts";
import { Button } from "@dniproanimals/ui";
import { useState } from "react";
import { AdoptionFlow } from "../AdoptionFlow";

interface AdoptButtonProps {
  animal: Animal;
}

export function AdoptButton({ animal }: AdoptButtonProps) {
  const [adoptOpen, setAdoptOpen] = useState(false);

  return (
    <>
      <AdoptionFlow
        open={adoptOpen}
        onOpenChange={setAdoptOpen}
        animalId={animal.id}
        onClose={() => setAdoptOpen(false)}
      />
      <Button variant="primary" size="md" onClick={() => setAdoptOpen(true)}>
        Забрати додому
      </Button>
    </>
  );
}
