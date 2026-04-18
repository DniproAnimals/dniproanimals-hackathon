import { AnimalsFilters } from "./components/AnimalsFilters";
import { AnimalsHeader } from "./components/AnimalsHeader";
import { AnimalsTable } from "./components/AnimalsTable";

export default function AnimalsPage() {
  return (
    <div className="max-w-5xl">
      <AnimalsHeader />
      <AnimalsFilters />
      <AnimalsTable />
    </div>
  );
}
