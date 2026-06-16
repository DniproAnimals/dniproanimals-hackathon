"use client";
import { useAnimalsQuery } from "@/shared/query-hooks";
import {
  Card,
  EmptyState,
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@dniproanimals/ui";
import { useAnimalsFilterState } from "../../hooks/useAnimalsFilterState";
import { AnimalsTableRow } from "./components/AnimalsTableRow";

export function AnimalsTable() {
  const [filters] = useAnimalsFilterState();
  const { data: animals = [] } = useAnimalsQuery({
    type: filters.type ?? undefined,
    status: filters.status ?? undefined,
    q: filters.q ?? undefined,
  });

  if (animals.length === 0) {
    return (
      <Card>
        <EmptyState title="Немає тварин" />
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Тварина</TableHead>
            <TableHead className="hidden sm:table-cell">Вид</TableHead>
            <TableHead className="hidden md:table-cell">Стать</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead className="text-right">Дії</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {animals.map((a) => (
            <AnimalsTableRow key={a.id} animal={a} />
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
