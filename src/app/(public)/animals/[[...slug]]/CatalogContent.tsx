"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useQueryStates, parseAsString } from "nuqs";
import Link from "next/link";
import AnimalCard from "@/components/AnimalCard";
import FilterBar from "@/components/FilterBar";
import { useUser } from "@/lib/UserContext";
import type { Animal } from "@/lib/db";
import { IconPlus, IconAdjustmentsHorizontal, IconSortDescending } from "@tabler/icons-react";

const typeValueToSlug: Record<string, string> = { dog: "dogs", cat: "cats", other: "other" };

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

function CatalogInner({ initialAnimals, slugType, slugSex, slugSize, seoH1, seoDescription }: Props) {
  const router = useRouter();
  const [animals, setAnimals] = useState(initialAnimals);
  const [loading, setLoading] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const { user } = useUser();

  const [secondary, setSecondary] = useQueryStates(secondaryParsers);

  // Build API query from all filters
  const apiQuery = (() => {
    const p = new URLSearchParams();
    if (slugType) p.set("type", slugType);
    if (slugSex) p.set("sex", slugSex);
    if (slugSize) p.set("size", slugSize);
    Object.entries(secondary).forEach(([k, v]) => { if (v) p.set(k, v); });
    return p.toString();
  })();

  // Re-fetch when secondary filters change
  const hasSecondary = Object.values(secondary).some(v => v != null);

  useEffect(() => {
    if (!hasSecondary) {
      setAnimals(initialAnimals);
      return;
    }
    setLoading(true);
    fetch(`/api/animals?${apiQuery}`)
      .then((r) => r.json())
      .then((data) => { setAnimals(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [apiQuery, hasSecondary, initialAnimals]);

  // Sync when SSR data changes (slug navigation)
  useEffect(() => {
    if (!hasSecondary) setAnimals(initialAnimals);
  }, [initialAnimals, hasSecondary]);

  // Navigate to slug URL when type/sex/size change
  const handlePrimaryChange = (key: string, value: string | null) => {
    let t = slugType, s = slugSex, sz = slugSize;
    if (key === "type") t = t === value ? null : value;
    if (key === "sex") s = s === value ? null : value;
    if (key === "size") sz = sz === value ? null : value;

    // If type is deselected, also clear sex/size (they depend on type for slug)
    if (!t) { s = null; sz = null; }

    const parts: string[] = [];
    if (t) parts.push(typeValueToSlug[t]);
    if (s) parts.push(s);
    if (sz) parts.push(sz);

    // Preserve secondary query params
    const query = new URLSearchParams(
      Object.entries(secondary).filter(([, v]) => v != null) as [string, string][]
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

  const isFiltered = !!seoH1;

  return (
    <div className="max-w-6xl mx-auto px-6 py-6 pb-24 md:pb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
            {seoH1 || "Наші хвостики"}
          </h1>
          <p className="text-sm text-gray-medium">
            {seoDescription || "Знайдіть свого нового друга серед наших підопічних"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {user?.role === "admin" && (
            <Link href="/dashboard/animals" className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#ced48c] text-foreground text-sm font-medium hover:bg-[#b8be72] transition-colors">
              <IconPlus size={14} />
              Додати
            </Link>
          )}
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="md:hidden flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-light text-sm font-medium"
          >
            <IconAdjustmentsHorizontal size={14} />
            Фільтри
            {mobileFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#ced48c] text-foreground text-[10px] font-bold flex items-center justify-center">
                {mobileFilterCount}
              </span>
            )}
          </button>
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
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-medium">
                Знайдено <span className="font-semibold text-foreground">{animals.length}</span>{" "}
                {animals.length === 1 ? "тварину" : animals.length < 5 ? "тварини" : "тварин"}
              </p>
              <div className="flex items-center gap-1.5">
                <IconSortDescending size={14} className="text-gray-medium" />
                <select
                  value={secondary.sort || ""}
                  onChange={(e) => setSecondary({ sort: e.target.value || null })}
                  className="text-sm bg-transparent border-none outline-none text-gray-medium cursor-pointer font-medium pr-1"
                >
                  <option value="">Нові спочатку</option>
                  <option value="oldest">Старі спочатку</option>
                  <option value="name_asc">А → Я</option>
                  <option value="name_desc">Я → А</option>
                  <option value="age_asc">Наймолодші</option>
                  <option value="age_desc">Найстарші</option>
                  <option value="weight_asc">Легкі спочатку</option>
                  <option value="weight_desc">Важкі спочатку</option>
                </select>
              </div>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i}>
                  <div className="bg-gray-light rounded-2xl animate-pulse aspect-square" />
                  <div className="mt-2.5 h-4 bg-gray-light rounded-lg w-2/3" />
                  <div className="mt-1.5 h-3 bg-gray-light rounded-lg w-1/2" />
                </div>
              ))}
            </div>
          ) : animals.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-green-light mx-auto flex items-center justify-center mb-4">
                <span className="text-4xl">🐾</span>
              </div>
              <p className="text-lg font-semibold text-foreground mb-1">Тварин поки немає</p>
              <p className="text-sm text-gray-medium">Скоро тут з&#39;являться хвостики, які шукають дім</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
              {animals.map((animal, i) => (
                <AnimalCard key={animal.id} animal={animal} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
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
                <div className="h-10 bg-gray-light rounded-xl animate-pulse" />
                <div className="h-32 bg-gray-light rounded-xl animate-pulse" />
              </div>
            </aside>
            <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i}>
                  <div className="bg-gray-light rounded-2xl animate-pulse aspect-square" />
                  <div className="mt-2.5 h-4 bg-gray-light rounded-lg w-2/3" />
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
