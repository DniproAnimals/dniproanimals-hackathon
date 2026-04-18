import { getServerQueryClient } from "@/shared/providers/getServerQueryClient";
import { animalsQueryOptions } from "@/shared/query-hooks";
import { listAnimalsQuerySchema } from "@dniproanimals/contracts";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import { CatalogContent } from "./components/CatalogContent";

export const metadata: Metadata = {
  title: "Тварини для усиновлення у Дніпрі | DniproAnimals",
  description:
    "Каталог тварин для усиновлення у Дніпрі. Собаки, коти та інші хвостики шукають дім.",
};

export default async function AnimalsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const parsed = listAnimalsQuerySchema.safeParse(sp);
  const filters = parsed.success ? parsed.data : {};

  const queryClient = getServerQueryClient();
  await queryClient.prefetchQuery(animalsQueryOptions(filters));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CatalogContent />
    </HydrationBoundary>
  );
}
