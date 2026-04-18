import { Skeleton } from "@dniproanimals/ui";

export function FavouritesLoading() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
      {[...Array(3)].map((_, i) => (
        <div key={i}>
          <Skeleton className="rounded-2xl aspect-square" />
          <Skeleton className="mt-2.5 h-4 rounded-lg w-2/3" />
        </div>
      ))}
    </div>
  );
}
