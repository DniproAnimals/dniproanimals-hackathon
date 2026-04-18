"use client";
import { useMeQuery } from "@/shared/query-hooks";
import { IconAdjustmentsHorizontal, IconPlus } from "@dniproanimals/icons";
import { Badge, Button } from "@dniproanimals/ui";
import Link from "next/link";
import { useCatalogActiveFilterCount } from "../../hooks/useCatalogFilterState";

interface AnimalsCatalogHeaderProps {
  onToggleMobileFilters: () => void;
}

export function AnimalsCatalogHeader({
  onToggleMobileFilters,
}: AnimalsCatalogHeaderProps) {
  const { data: user } = useMeQuery();
  const activeCount = useCatalogActiveFilterCount();

  return (
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
          onClick={onToggleMobileFilters}
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
  );
}
