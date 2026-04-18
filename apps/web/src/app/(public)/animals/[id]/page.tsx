import { apiClient } from "@/shared/api-client";
import { getServerQueryClient } from "@/shared/providers/getServerQueryClient";
import { animalQueryOptions } from "@/shared/query-hooks";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AnimalDetail from "./AnimalDetail";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isFinite(numericId) || numericId <= 0) {
    return { title: "Тварину не знайдено | DniproAnimals" };
  }
  try {
    const animal = await apiClient.animals.get(numericId);
    const tw =
      animal.type === "dog"
        ? "собака"
        : animal.type === "cat"
          ? "кіт"
          : "тварина";
    return {
      title: `${animal.name} — ${tw} для усиновлення | DniproAnimals`,
      description: `${animal.name} — ${animal.breed || "мікс порід"} шукає дім у Дніпрі.`,
    };
  } catch {
    return { title: "Тварину не знайдено | DniproAnimals" };
  }
}

export default async function AnimalDetailPageRoute({
  params,
}: {
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
      <AnimalDetail id={String(numericId)} />
    </HydrationBoundary>
  );
}
