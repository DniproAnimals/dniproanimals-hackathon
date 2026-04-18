import { IconChevronLeft } from "@dniproanimals/icons";
import { Button } from "@dniproanimals/ui";
import Image from "next/image";
import Link from "next/link";

export default function OnboardingOrganizationLayout({
  children,
}: LayoutProps<"/onboarding/organization">) {
  return (
    <div className="max-w-2xl mx-auto px-6 py-6 pb-24 md:pb-6">
      <div className="flex items-center justify-between mb-8">
        <Button asChild variant="ghost" size="sm" className="gap-1.5">
          <Link href="/onboarding">
            <IconChevronLeft size={18} />
            Назад
          </Link>
        </Button>
        <Image
          src="/logo.jpg"
          alt="DniproAnimals"
          width={36}
          height={36}
          className="rounded-full object-cover"
        />
        <div className="w-16" />
      </div>

      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-1">Створити організацію</h1>
        <p className="text-sm text-gray-medium">
          Зареєструйте свій притулок на платформі DniproAnimals
        </p>
      </div>

      {children}
      <p className="text-xs text-gray-medium text-center mt-5">
        Після створення організація потрапить на модерацію
      </p>
    </div>
  );
}
