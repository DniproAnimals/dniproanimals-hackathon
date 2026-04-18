export function AnimalDetailSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="animate-pulse md:grid md:grid-cols-2 md:gap-10">
        <div className="bg-gray-light rounded-2xl aspect-square" />
        <div className="mt-6 md:mt-0">
          <div className="h-8 bg-gray-light rounded-lg w-1/3 mb-4" />
          <div className="h-4 bg-gray-light rounded-lg w-2/3 mb-3" />
          <div className="h-4 bg-gray-light rounded-lg w-1/2" />
        </div>
      </div>
    </div>
  );
}
