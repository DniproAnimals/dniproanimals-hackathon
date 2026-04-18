"use client";
import { Button } from "@dniproanimals/ui";
import { useRouter } from "next/navigation";

export function AnimalNotFound() {
  const router = useRouter();
  return (
    <div className="max-w-6xl mx-auto px-6 py-20 text-center">
      <div className="size-20 rounded-full bg-gray-light mx-auto flex items-center justify-center mb-4">
        <span className="text-4xl">😿</span>
      </div>
      <p className="text-lg font-semibold mb-1">Тварину не знайдено</p>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push("/")}
        className="mt-3 text-green-accent font-medium"
      >
        ← Повернутися до каталогу
      </Button>
    </div>
  );
}
