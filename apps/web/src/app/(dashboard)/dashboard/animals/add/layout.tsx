import { IconChevronLeft } from "@dniproanimals/icons";
import { Button } from "@dniproanimals/ui";
import Link from "next/link";

export default function AddAnimalLayout({
  children,
}: LayoutProps<"/dashboard/animals/add">) {
  return (
    <div className="max-w-2xl mx-auto px-6 py-6 pb-24 md:pb-6">
      <Button asChild variant="ghost" size="sm" className="mb-5 gap-2">
        <Link href="/dashboard/animals">
          <IconChevronLeft size={18} />
          Назад
        </Link>
      </Button>
      <h1 className="text-2xl font-bold mb-6">Додати тварину</h1>
      {children}
    </div>
  );
}
