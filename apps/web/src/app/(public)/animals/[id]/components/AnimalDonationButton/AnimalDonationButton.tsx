"use client";
import { useMeQuery } from "@/shared/query-hooks";
import { IconHeart } from "@dniproanimals/icons";
import { Button, Dialog } from "@dniproanimals/ui";
import { useState } from "react";
import { AnimalDonationDialog } from "./components/AnimalDonationDialog";

interface AnimalDonationButtonProps {
  animalId: number;
  animalName: string;
}

export function AnimalDonationButton({
  animalId,
  animalName,
}: AnimalDonationButtonProps) {
  const [open, setOpen] = useState(false);
  const { data: user, isLoading: isUserLoading } = useMeQuery();

  return (
    <>
      <Button
        variant="soft"
        size="lg"
        className="mb-6 w-full"
        onClick={() => setOpen(true)}
      >
        <IconHeart aria-hidden="true" />
        Підтримати {animalName}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        {open && (
          <AnimalDonationDialog
            animalId={animalId}
            animalName={animalName}
            user={user}
            isUserLoading={isUserLoading}
          />
        )}
      </Dialog>
    </>
  );
}
