"use client";
import { IconShieldCheck } from "@dniproanimals/icons";
import { Button } from "@dniproanimals/ui";
import { useDonateFormContext } from "../../hooks/useDonateForm";

export function DonateSubmitButton() {
  const {
    formState: { isSubmitting },
  } = useDonateFormContext();

  return (
    <>
      <Button
        type="submit"
        variant="secondary"
        disabled={isSubmitting}
        className="w-full py-5 h-auto rounded-2xl text-xl font-bold uppercase"
      >
        Допомогти хвостатим
      </Button>
      <p className="text-xs text-center text-gray-400 mt-4 flex items-center justify-center gap-1">
        <IconShieldCheck size={12} />
        Безпечний платіж через Monobank
      </p>
    </>
  );
}
