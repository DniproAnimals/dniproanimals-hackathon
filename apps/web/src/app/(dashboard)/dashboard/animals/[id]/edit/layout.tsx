import { IconChevronLeft } from "@dniproanimals/icons";
import { Button } from "@dniproanimals/ui";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EditAnimalLayout({
  children,
  params,
}: LayoutProps<"/dashboard/animals/[id]/edit">) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isFinite(numericId) || numericId <= 0) notFound();

  return (
    <div className="max-w-2xl mx-auto px-6 py-6 pb-24 md:pb-6">
      <Button asChild variant="ghost" size="sm" className="mb-5 gap-2">
        <Link href="/dashboard/animals">
          <IconChevronLeft size={18} />
          Назад
        </Link>
      </Button>
      <h1 className="text-2xl font-bold mb-6">Редагувати тварину</h1>
      {children}
    </div>
  );
}
