import { Button } from "@dniproanimals/ui";
import Link from "next/link";

export function AnimalsHeader() {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold text-foreground">Тварини</h1>
      <Button asChild variant="primary">
        <Link href="/dashboard/animals/add">Додати тварину</Link>
      </Button>
    </div>
  );
}
