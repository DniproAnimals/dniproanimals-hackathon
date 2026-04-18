"use client";
import { useMeQuery } from "@/shared/query-hooks";
import { IconHomeFilled, IconUserFilled } from "@dniproanimals/icons";
import Image from "next/image";
import Link from "next/link";

const options = [
  {
    href: "/",
    icon: IconUserFilled,
    title: "Особисте використання",
    description: "Шукати тварин, додавати в обране, допомагати",
  },
  {
    href: "/onboarding/organization",
    icon: IconHomeFilled,
    title: "Створити організацію",
    description: "Зареєструвати притулок або волонтерську організацію",
  },
];

export default function OnboardingPage() {
  const { data: user } = useMeQuery();

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <Image
            src="/logo.jpg"
            alt="DniproAnimals"
            width={48}
            height={48}
            className="rounded-full object-cover mb-3"
          />
          <h1 className="text-xl font-bold text-foreground mb-1">
            Вітаємо, {user?.name}!
          </h1>
          <p className="text-sm text-gray-medium text-center">
            Як ви плануєте використовувати платформу?
          </p>
        </div>

        <div className="space-y-3">
          {options.map(({ href, icon: Icon, title, description }) => (
            <Link
              key={href}
              href={href}
              className="w-full block bg-white rounded-2xl border border-gray-border p-5 text-left hover:border-primary transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-xl bg-gray-light flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                  <Icon size={24} className="text-gray-medium" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{title}</p>
                  <p className="text-xs text-gray-medium mt-0.5">
                    {description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
