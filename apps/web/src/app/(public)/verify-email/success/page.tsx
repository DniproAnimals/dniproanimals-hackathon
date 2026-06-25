import { Button } from "@dniproanimals/ui";
import Link from "next/link";

export default function VerifyEmailSuccessPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-lg text-center space-y-6">
        <h1 className="text-2xl font-bold text-foreground">
          Пошту підтверджено
        </h1>
        <p className="text-gray-medium">
          Дякуємо! Тепер ви можете увійти до свого акаунта.
        </p>
        <Button asChild>
          <Link href="/auth/signin">Увійти</Link>
        </Button>
      </div>
    </div>
  );
}
