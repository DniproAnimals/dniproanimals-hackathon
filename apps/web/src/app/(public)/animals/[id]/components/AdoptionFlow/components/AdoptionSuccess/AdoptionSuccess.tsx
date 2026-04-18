"use client";
import {
  Button,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@dniproanimals/ui";

export function AdoptionSuccess({ onClose }: { onClose: () => void }) {
  return (
    <DialogContent className="max-w-sm text-center" hideClose>
      <DialogHeader className="sr-only">
        <DialogTitle>Дякуємо!</DialogTitle>
        <DialogDescription>Вашу заявку отримано</DialogDescription>
      </DialogHeader>
      <div className="animate-modal-success">
        <p className="text-2xl mb-2">💚</p>
        <p className="text-lg font-semibold text-foreground mb-1">Дякуємо!</p>
        <p className="text-sm text-gray-medium mb-4">
          Вашу заявку отримано. Ми зв&apos;яжемося з вами найближчим часом.
        </p>
        <Button variant="primary" size="md" onClick={onClose}>
          Закрити
        </Button>
      </div>
    </DialogContent>
  );
}
