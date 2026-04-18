import { getServerQueryClient } from "@/shared/providers/getServerQueryClient";
import { lostQueryOptions } from "@/shared/query-hooks";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import { LostHeader } from "./components/LostHeader";
import { LostList } from "./components/LostList";

export const metadata: Metadata = {
  title: "Загублені тварини у Дніпрі | DniproAnimals",
  description:
    "Допоможіть знайти господарів для загублених тварин у Дніпрі. Оголошення про зниклих собак, котів та інших хвостиків.",
};

export default async function LostPage() {
  const queryClient = getServerQueryClient();
  await queryClient.prefetchQuery(lostQueryOptions({ type: "lost" }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="max-w-6xl mx-auto px-6 py-6 pb-24 md:pb-6">
        <LostHeader />
        <LostList />
      </div>
    </HydrationBoundary>
  );
}
