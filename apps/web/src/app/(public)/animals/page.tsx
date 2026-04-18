"use client";
import { useAnimalsQuery } from "@/shared/query-hooks";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { AnimalsCatalogHeader } from "./components/AnimalsCatalogHeader";
import { AnimalsList } from "./components/AnimalsList";
import { AnimalsListHeader } from "./components/AnimalsListHeader";
import { FilterBar } from "./components/FilterBar";
import { useCatalogFilterState } from "./hooks/useCatalogFilterState";

export default function AnimalsPage() {
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [params] = useCatalogFilterState();
  const { data: animals = [], isLoading } = useAnimalsQuery(params);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="max-w-6xl mx-auto px-6 py-6 pb-24 md:pb-6"
    >
      <AnimalsCatalogHeader
        onToggleMobileFilters={() => setShowMobileFilters((v) => !v)}
      />

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
          <AnimalsListHeader total={animals.length} />
          <AnimatePresence mode="wait">
            <AnimalsList animals={animals} isLoading={isLoading} />
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
