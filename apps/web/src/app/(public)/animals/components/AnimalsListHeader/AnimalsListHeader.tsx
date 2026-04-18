import { pluralize } from "@/shared/utils";
import { AnimalsListSortSelect } from "./components/AnimalsListSortSelect";

interface AnimalsListHeaderProps {
  total: number;
}

export function AnimalsListHeader({ total }: AnimalsListHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <p className="text-sm text-gray-medium">
        Знайдено <span className="font-semibold text-foreground">{total}</span>{" "}
        {pluralize(total, ["тварину", "тварини", "тварин"])}
      </p>
      <AnimalsListSortSelect />
    </div>
  );
}
