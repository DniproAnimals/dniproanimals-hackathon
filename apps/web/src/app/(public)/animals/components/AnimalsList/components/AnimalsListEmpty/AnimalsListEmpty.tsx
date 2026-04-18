import { EmptyState } from "@dniproanimals/ui";

export function AnimalsListEmpty() {
  return (
    <EmptyState
      icon={
        <div className="size-20 rounded-full bg-green-light mx-auto flex items-center justify-center">
          <span className="text-4xl">🐾</span>
        </div>
      }
      title="Тварин поки немає"
      description="Скоро тут з'являться хвостики, які шукають дім"
    />
  );
}
