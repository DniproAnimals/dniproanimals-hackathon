import { Skeleton } from "@dniproanimals/ui";

export function OrganizationsLoading() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="rounded-2xl h-64" />
      ))}
    </div>
  );
}
