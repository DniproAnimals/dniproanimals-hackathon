"use client";
import AnimalCard from "@/components/AnimalCard";
import FilterBar from "@/components/FilterBar";
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
} from "@/components/ui";
import { useUser } from "@/shared/lib/UserContext";
import type { Animal } from "@/shared/lib/db";
import {
  IconAdjustmentsHorizontal,
  IconPlus,
  IconSortDescending,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { parseAsString, useQueryStates } from "nuqs";
import { Suspense, useEffect, useState, useTransition } from "react";

const typeValueToSlug: Record<string, string> = {
  dog: "dogs",
  cat: "cats",
  other: "other",
};

type Props = {
  initialAnimals: Animal[];
  slugType: string | null;
  slugSex: string | null;
  slugSize: string | null;
  seoH1?: string;
  seoDescription?: string;
};

const secondaryParsers = {
  breed: parseAsString,
  color: parseAsString,
  vaccinated: parseAsString,
  sterilized: parseAsString,
  trained: parseAsString,
  q: parseAsString,
  sort: parseAsString,
};

function CatalogInner({
  initialAnimals,
  slugType,
  slugSex,
  slugSize,
  seoH1,
  seoDescription,
}: Props) {
  const router = useRouter();
  const [fetchedAnimals, setFetchedAnimals] = useState<Animal[] | null>(null);
  const [loading, startTransition] = useTransition();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const { user } = useUser();

  const [secondary, setSecondary] = useQueryStates(secondaryParsers);

  // Build API query from all filters
  const apiQuery = (() => {
    const p = new URLSearchParams();
    if (slugType) p.set("type", slugType);
    if (slugSex) p.set("sex", slugSex);
    if (slugSize) p.set("size", slugSize);
    Object.entries(secondary).forEach(([k, v]) => {
      if (v) p.set(k, v);
    });
    return p.toString();
  })();

  // Re-fetch when secondary filters change
  const hasSecondary = Object.values(secondary).some((v) => v != null);

  const animals =
    hasSecondary && fetchedAnimals ? fetchedAnimals : initialAnimals;

  useEffect(() => {
    if (!hasSecondary) return;
    let cancelled = false;
    startTransition(async () => {
      try {
        const r = await fetch(`/api/animals?${apiQuery}`);
        const data = await r.json();
        if (!cancelled) setFetchedAnimals(data);
      } catch {
        /* ignore */
      }
    });
    return () => {
      cancelled = true;
    };
  }, [apiQuery, hasSecondary]);

  // Navigate to slug URL when type/sex/size change
  const handlePrimaryChange = (key: string, value: string | null) => {
    let t = slugType,
      s = slugSex,
      sz = slugSize;
    if (key === "type") t = t === value ? null : value;
    if (key === "sex") s = s === value ? null : value;
    if (key === "size") sz = sz === value ? null : value;

    // If type is deselected, also clear sex/size (they depend on type for slug)
    if (!t) {
      s = null;
      sz = null;
    }

    const parts: string[] = [];
    if (t) parts.push(typeValueToSlug[t]);
    if (s) parts.push(s);
    if (sz) parts.push(sz);

    // Preserve secondary query params
    const query = new URLSearchParams(
      Object.entries(secondary).filter(([, v]) => v != null) as [
        string,
        string,
      ][],
    ).toString();

    const url = `/animals${parts.length ? `/${parts.join("/")}` : ""}${query ? `?${query}` : ""}`;
    router.push(url, { scroll: false });
  };

  // Mobile filter count
  let mobileFilterCount = 0;
  if (slugType) mobileFilterCount++;
  if (slugSex) mobileFilterCount++;
  if (slugSize) mobileFilterCount++;
  for (const k of ["breed", "color"] as const) {
    const v = secondary[k];
    if (v) mobileFilterCount += v.split(",").filter(Boolean).length;
  }
  if (secondary.vaccinated === "1") mobileFilterCount++;
  if (secondary.sterilized === "1") mobileFilterCount++;
  if (secondary.trained === "1") mobileFilterCount++;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="max-w-6xl mx-auto px-6 py-6 pb-24 md:pb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <motion.div
          key={`heading-${slugType}-${slugSex}-${slugSize}`}
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
            {seoH1 || "Наші хвостики"}
          </h1>
          <p className="text-sm text-gray-medium">
            {seoDescription ||
              "Знайдіть свого нового друга серед наших підопічних"}
          </p>
        </motion.div>
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
            {mobileFilterCount > 0 && (
              <Badge
                variant="brand"
                size="xs"
                className="size-5 p-0 justify-center text-[10px] font-bold"
              >
                {mobileFilterCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      <div className="md:flex md:gap-8">
        <aside className="hidden md:block w-56 shrink-0">
          <div className="sticky top-20">
            <FilterBar
              slugType={slugType}
              slugSex={slugSex}
              slugSize={slugSize}
              onPrimaryChange={handlePrimaryChange}
              onReset={() => router.push("/animals", { scroll: false })}
            />
          </div>
        </aside>

        {showMobileFilters && (
          <div className="md:hidden mb-5">
            <FilterBar
              slugType={slugType}
              slugSex={slugSex}
              slugSize={slugSize}
              onPrimaryChange={handlePrimaryChange}
              onReset={() => router.push("/animals", { scroll: false })}
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          {!loading && animals.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-between mb-4"
            >
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
                  value={secondary.sort || "newest"}
                  onValueChange={(v) =>
                    setSecondary({ sort: v === "newest" ? null : v })
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
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-2 lg:grid-cols-3 gap-5"
              >
                {[...Array(6)].map((_, i) => (
                  <div key={i}>
                    <Skeleton className="rounded-2xl aspect-square" />
                    <Skeleton className="mt-2.5 h-4 rounded-lg w-2/3" />
                    <Skeleton className="mt-1.5 h-3 rounded-lg w-1/2" />
                  </div>
                ))}
              </motion.div>
            ) : animals.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <EmptyState
                  icon={
                    <div className="size-20 rounded-full bg-green-light mx-auto flex items-center justify-center">
                      <span className="text-4xl">🐾</span>
                    </div>
                  }
                  title="Тварин поки немає"
                  description="Скоро тут з'являться хвостики, які шукають дім"
                />
              </motion.div>
            ) : (
              <motion.div
                key={`grid-${slugType}-${slugSex}-${slugSize}`}
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

export default function CatalogContent(props: Props) {
  return (
    <Suspense
      fallback={
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="md:flex md:gap-8">
            <aside className="hidden md:block w-56 shrink-0">
              <div className="space-y-3">
                <Skeleton className="h-10 rounded-xl" />
                <Skeleton className="h-32 rounded-xl" />
              </div>
            </aside>
            <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i}>
                  <Skeleton className="rounded-2xl aspect-square" />
                  <Skeleton className="mt-2.5 h-4 rounded-lg w-2/3" />
                </div>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <CatalogInner {...props} />
    </Suspense>
  );
}
