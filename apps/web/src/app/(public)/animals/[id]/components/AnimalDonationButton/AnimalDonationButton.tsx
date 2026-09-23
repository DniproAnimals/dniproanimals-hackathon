"use client";
import { useAnimalDonationStatusQuery, useMeQuery } from "@/shared/query-hooks";
import { IconHeart } from "@dniproanimals/icons";
import { Button, Dialog } from "@dniproanimals/ui";
import { useState } from "react";
import { AnimalDonationDialog } from "./components/AnimalDonationDialog";

interface AnimalDonationButtonProps {
  animalId: number;
  animalName: string;
  donationsEnabled: boolean;
}

export function AnimalDonationButton({
  animalId,
  animalName,
  donationsEnabled,
}: AnimalDonationButtonProps) {
  const [open, setOpen] = useState(false);
  const { data: user, isLoading: isUserLoading } = useMeQuery();
  const status = useAnimalDonationStatusQuery(animalId, {
    enabled: Boolean(user),
  });
  const active = status.data?.active ?? false;

  if (!donationsEnabled && (!user || status.isLoading || !active)) return null;

  return (
    <>
      <Button
        variant={active ? "outline" : "soft"}
        size="lg"
        className="mb-6 w-full"
        onClick={() => setOpen(true)}
      >
        <IconHeart aria-hidden="true" />
        {active ? "Припинити підтримку" : `Підтримати ${animalName}`}
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
