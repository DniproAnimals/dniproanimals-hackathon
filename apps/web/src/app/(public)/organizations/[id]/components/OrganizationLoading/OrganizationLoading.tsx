import { Skeleton } from "@dniproanimals/ui";

export function OrganizationLoading() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <div className="space-y-6">
        <Skeleton className="h-48 rounded-2xl" />
        <Skeleton className="h-8 rounded-lg w-1/3" />
        <Skeleton className="h-4 rounded-lg w-2/3" />
      </div>
    </div>
  );
}
