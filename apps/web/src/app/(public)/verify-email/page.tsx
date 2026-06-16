import { Button } from "@dniproanimals/ui";
import Link from "next/link";

export default function VerifyEmailPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-lg text-center space-y-6">
        <h1 className="text-2xl font-bold text-foreground">
          Підтвердьте вашу пошту
        </h1>
        <p className="text-gray-medium">
          Ми надіслали лист із посиланням для підтвердження. Відкрийте його і
          перейдіть за посиланням, щоб активувати акаунт.
        </p>
        <div className="rounded-xl border border-gray-border bg-white p-6 text-sm text-gray-medium">
          <p>Якщо листа немає — перевірте папку «Спам».</p>
          <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button asChild variant="outline">
              <a href="http://localhost:8025" target="_blank" rel="noreferrer">
                Mailpit (тест)
              </a>
            </Button>
            <Button asChild>
              <Link href="/auth/signin">Увійти</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
