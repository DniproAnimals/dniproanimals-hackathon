"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import AnimalCard from "@/components/AnimalCard";
import FilterBar from "@/components/FilterBar";
import { useUser } from "@/lib/UserContext";
import type { Animal } from "@/lib/db";
import { useSearchParams, useRouter } from "next/navigation";
import { IconPlus, IconAdjustmentsHorizontal, IconSortDescending } from "@tabler/icons-react";

function CatalogContent() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    fetch(`/api/animals?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setAnimals(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [searchParams]);

  // Count active filters for mobile badge
  let mobileFilterCount = 0;
  for (const key of ["type", "sex", "size"]) {
    const raw = searchParams.get(key);
    if (raw) mobileFilterCount += raw.split(",").filter(Boolean).length;
  }
  for (const key of ["vaccinated", "sterilized", "trained"]) {
    if (searchParams.get(key) === "1") mobileFilterCount++;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-6 pb-24 md:pb-6">
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
            <Link href="/admin/add" className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#ced48c] text-foreground text-sm font-medium hover:bg-[#b8be72] transition-colors">
              <IconPlus size={14} />
              Додати
            </Link>
          )}
          {/* Mobile filter toggle */}
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
        {/* Desktop sidebar filters */}
        <aside className="hidden md:block w-56 flex-shrink-0">
          <div className="sticky top-20">
            <FilterBar />
          </div>
        </aside>

        {/* Mobile filters */}
        {showMobileFilters && (
          <div className="md:hidden mb-5">
            <FilterBar />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Results header: count + sort */}
          {!loading && animals.length > 0 && (
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-medium">
                Знайдено <span className="font-semibold text-foreground">{animals.length}</span> {animals.length === 1 ? "тварину" : animals.length < 5 ? "тварини" : "тварин"}
              </p>
              <div className="flex items-center gap-1.5">
                <IconSortDescending size={14} className="text-gray-medium" />
                <select
                  value={searchParams.get("sort") || ""}
                  onChange={(e) => {
                    const params = new URLSearchParams(searchParams.toString());
                    if (e.target.value) {
                      params.set("sort", e.target.value);
                    } else {
                      params.delete("sort");
                    }
                    router.push(`/?${params.toString()}`);
                  }}
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
              <p className="text-lg font-semibold text-foreground mb-1">
                Тварин поки немає
              </p>
              <p className="text-sm text-gray-medium">
                Скоро тут з&#39;являться хвостики, які шукають дім
              </p>
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

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="md:flex md:gap-8">
            <aside className="hidden md:block w-56 flex-shrink-0">
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
      <CatalogContent />
    </Suspense>
  );
}
