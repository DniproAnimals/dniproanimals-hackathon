import { getServerQueryClient } from "@/shared/providers/getServerQueryClient";
import { animalQueryOptions } from "@/shared/query-hooks";
import { IconChevronLeft } from "@dniproanimals/icons";
import { Button } from "@dniproanimals/ui";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

export default async function EditAnimalLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isFinite(numericId) || numericId <= 0) notFound();

  const queryClient = getServerQueryClient();
  try {
    await queryClient.fetchQuery(animalQueryOptions(numericId));
  } catch {
    notFound();
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
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
    </HydrationBoundary>
  );
}
