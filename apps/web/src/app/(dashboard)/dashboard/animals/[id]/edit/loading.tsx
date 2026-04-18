import { Skeleton } from "@dniproanimals/ui";

export default function Loading() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-20 text-center">
      <Skeleton className="size-10 rounded-full mx-auto" />
    </div>
  );
}
