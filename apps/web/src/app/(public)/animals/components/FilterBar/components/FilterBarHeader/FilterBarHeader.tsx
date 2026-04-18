"use client";
import {
  CATALOG_FILTER_RESET,
  useCatalogActiveFilterCount,
  useCatalogFilterState,
} from "../../../../hooks/useCatalogFilterState";

export function FilterBarHeader() {
  const [, setFilters] = useCatalogFilterState();
  const total = useCatalogActiveFilterCount();

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold text-gray-medium uppercase tracking-wider">
        Фільтри
      </span>
      {total > 0 && (
        <span className="inline-flex size-4 items-center justify-center rounded-full bg-primary text-foreground text-[9px] font-bold">
          {total}
        </span>
      )}
      {total > 0 && (
        <button
          type="button"
          onClick={() => setFilters(CATALOG_FILTER_RESET)}
          className="ml-auto text-[10px] text-gray-medium hover:text-foreground transition-colors"
        >
          Скинути
        </button>
      )}
    </div>
  );
}
