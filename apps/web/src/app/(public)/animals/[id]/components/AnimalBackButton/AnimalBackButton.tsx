"use client";
import { IconChevronLeft } from "@dniproanimals/icons";
import { Button } from "@dniproanimals/ui";
import { useRouter } from "next/navigation";

export function AnimalBackButton() {
  const router = useRouter();
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => router.back()}
      className="flex items-center gap-2 text-gray-medium hover:text-foreground mb-5 -ml-3"
    >
      <IconChevronLeft size={18} />
      Назад
    </Button>
  );
}
