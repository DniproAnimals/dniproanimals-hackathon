"use client";
import AnimalCard from "@/shared/components/AnimalCard";
import { useAnimalsQuery, useMeQuery } from "@/shared/query-hooks";
import type {
  ListAnimalsQuery,
  ListAnimalsSort,
} from "@dniproanimals/contracts";
import {
  IconAdjustmentsHorizontal,
  IconPlus,
  IconSortDescending,
} from "@dniproanimals/icons";
import {
  Badge,
  Button,
  EmptyState,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
} from "@dniproanimals/ui";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { useCatalogFilterState } from "../../hooks/useCatalogFilterState";
import FilterBar from "../FilterBar";

function toParams(
  values: ReturnType<typeof useCatalogFilterState>[0],
): ListAnimalsQuery {
  const parsed01 = (v: string | null): "0" | "1" | undefined =>
    v === "0" || v === "1" ? v : undefined;
  return {
    type: values.type ?? undefined,
    sex: values.sex ?? undefined,
    size: values.size ?? undefined,
    breed: values.breed ?? undefined,
    color: values.color ?? undefined,
    vaccinated: parsed01(values.vaccinated),
    sterilized: parsed01(values.sterilized),
    trained: parsed01(values.trained),
    q: values.q ?? undefined,
    sort: (values.sort as ListAnimalsSort | null) ?? undefined,
  };
}

function countActive(
  values: ReturnType<typeof useCatalogFilterState>[0],
): number {
  let n = 0;
  if (values.type) n++;
  if (values.sex) n++;
  if (values.size) n++;
  for (const k of ["breed", "color"] as const) {
    const v = values[k];
    if (v) n += v.split(",").filter(Boolean).length;
  }
  if (values.vaccinated === "1") n++;
  if (values.sterilized === "1") n++;
  if (values.trained === "1") n++;
  return n;
}

export default function CatalogContent() {
  const [filters, setFilters] = useCatalogFilterState();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const { data: user } = useMeQuery();

  const { data: animals = [], isFetching } = useAnimalsQuery(toParams(filters));
  const activeCount = countActive(filters);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="max-w-6xl mx-auto px-6 py-6 pb-24 md:pb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
            Наші хвостики
          </h1>
          <p className="text-sm text-gray-medium">
            Знайдіть свого нового друга серед наших підопічних
          </p>
        </div>
        <div className="flex items-center gap-2">
          {user?.role === "admin" && (
            <Button asChild variant="primary" size="sm">
              <Link href="/dashboard/animals">
                <IconPlus size={14} />
                Додати
              </Link>
            </Button>
          )}
          <Button
            variant="subtle"
            size="sm"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="md:hidden"
          >
            <IconAdjustmentsHorizontal size={14} />
            Фільтри
            {activeCount > 0 && (
              <Badge
                variant="brand"
                size="xs"
                className="size-5 p-0 justify-center text-[10px] font-bold"
              >
                {activeCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      <div className="md:flex md:gap-8">
        <aside className="hidden md:block w-56 shrink-0">
          <div className="sticky top-20">
            <FilterBar />
          </div>
        </aside>

        {showMobileFilters && (
          <div className="md:hidden mb-5">
            <FilterBar />
          </div>
        )}

        <div className="flex-1 min-w-0">
          {!isFetching && animals.length > 0 && (
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-medium">
                Знайдено{" "}
                <span className="font-semibold text-foreground">
                  {animals.length}
                </span>{" "}
                {animals.length === 1
                  ? "тварину"
                  : animals.length < 5
                    ? "тварини"
                    : "тварин"}
              </p>
              <div className="flex items-center gap-1.5">
                <IconSortDescending size={14} className="text-gray-medium" />
                <Select
                  value={filters.sort || "newest"}
                  onValueChange={(v) =>
                    setFilters({ sort: v === "newest" ? null : v })
                  }
                >
                  <SelectTrigger className="h-auto border-none bg-transparent px-0 text-sm text-gray-medium font-medium w-auto gap-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Нові спочатку</SelectItem>
                    <SelectItem value="oldest">Старі спочатку</SelectItem>
                    <SelectItem value="name_asc">А → Я</SelectItem>
                    <SelectItem value="name_desc">Я → А</SelectItem>
                    <SelectItem value="age_asc">Наймолодші</SelectItem>
                    <SelectItem value="age_desc">Найстарші</SelectItem>
                    <SelectItem value="weight_asc">Легкі спочатку</SelectItem>
                    <SelectItem value="weight_desc">Важкі спочатку</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {isFetching ? (
              <motion.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-2 lg:grid-cols-3 gap-5"
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i}>
                    <Skeleton className="rounded-2xl aspect-square" />
                    <Skeleton className="mt-2.5 h-4 rounded-lg w-2/3" />
                    <Skeleton className="mt-1.5 h-3 rounded-lg w-1/2" />
                  </div>
                ))}
              </motion.div>
            ) : animals.length === 0 ? (
              <EmptyState
                icon={
                  <div className="size-20 rounded-full bg-green-light mx-auto flex items-center justify-center">
                    <span className="text-4xl">🐾</span>
                  </div>
                }
                title="Тварин поки немає"
                description="Скоро тут з'являться хвостики, які шукають дім"
              />
            ) : (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-2 lg:grid-cols-3 gap-5"
              >
                {animals.map((animal, i) => (
                  <motion.div
                    key={animal.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.35,
                      delay: i * 0.05,
                      ease: "easeOut",
                    }}
                  >
                    <AnimalCard animal={animal} index={i} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
