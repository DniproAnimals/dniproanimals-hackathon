"use client";
import ImageFallback from "@/shared/components/ImageFallback";
import {
  useAnimalsQuery,
  useDeleteAnimalMutation,
} from "@/shared/query-hooks";
import type { AnimalStatus, AnimalType } from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@dniproanimals/ui";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { useDashboard } from "../layout";

export default function AnimalsPage() {
  const qc = useQueryClient();
  const { org } = useDashboard();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<AnimalType | "">("");
  const [statusFilter, setStatusFilter] = useState<AnimalStatus | "">("");

  const { data: animals = [] } = useAnimalsQuery(
    {
      orgId: org?.id,
      type: typeFilter || undefined,
      status: statusFilter || undefined,
      q: search || undefined,
    },
    { enabled: !!org?.id },
  );

  const deleteMut = useDeleteAnimalMutation({
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: [endpoints.animals.list()] }),
  });

  const handleDelete = (id: number) => {
    if (!confirm("Видалити тварину?")) return;
    deleteMut.mutate(id);
  };

  const typeLabel = (t: string) =>
    t === "dog" ? "Собака" : t === "cat" ? "Кіт" : "Інше";
  const statusLabel = (s: string) =>
    s === "available"
      ? "Шукає дім"
      : s === "adopted"
        ? "Усиновлено"
        : "Заброньовано";
  const statusVariant = (s: string): "success" | "info" | "warning" =>
    s === "available" ? "success" : s === "adopted" ? "info" : "warning";
  const sexLabel = (s: string | null) =>
    s === "male" ? "Хлопчик" : s === "female" ? "Дівчинка" : "";

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Тварини</h1>
        <Button asChild variant="primary">
          <Link href="/dashboard/animals/edit">Додати тварину</Link>
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <Input
          type="text"
          placeholder="Пошук..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-white w-56"
        />
        <Select
          value={typeFilter || "all"}
          onValueChange={(v) =>
            setTypeFilter(v === "all" ? "" : (v as AnimalType))
          }
        >
          <SelectTrigger className="bg-white w-auto">
            <SelectValue placeholder="Усі види" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Усі види</SelectItem>
            <SelectItem value="dog">Собаки</SelectItem>
            <SelectItem value="cat">Коти</SelectItem>
            <SelectItem value="other">Інше</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={statusFilter || "all"}
          onValueChange={(v) =>
            setStatusFilter(v === "all" ? "" : (v as AnimalStatus))
          }
        >
          <SelectTrigger className="bg-white w-auto">
            <SelectValue placeholder="Усі статуси" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Усі статуси</SelectItem>
            <SelectItem value="available">Шукає дім</SelectItem>
            <SelectItem value="reserved">Заброньовано</SelectItem>
            <SelectItem value="adopted">Усиновлено</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-xs text-gray-medium">
          {animals.length} тварин
        </span>
      </div>

      {animals.length === 0 ? (
        <Card>
          <EmptyState title="Немає тварин" />
        </Card>
      ) : (
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
              {animals.map((a) => {
                const photo = a.photos[0];
                return (
                  <TableRow key={a.id}>
                    <TableCell>
                      <Link
                        href={`/animals/${a.id}`}
                        className="flex items-center gap-3"
                      >
                        {photo ? (
                          <ImageFallback
                            src={photo}
                            alt={a.name}
                            width={36}
                            height={36}
                            className="size-9 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="size-9 rounded-lg bg-muted flex items-center justify-center text-xs text-gray-medium">
                            {a.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-foreground">
                            {a.name}
                          </p>
                          {a.breed && (
                            <p className="text-xs text-gray-medium">
                              {a.breed}
                            </p>
                          )}
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-gray-medium">
                      {typeLabel(a.type)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-gray-medium">
                      {sexLabel(a.sex)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(a.status)} size="sm">
                        {statusLabel(a.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          asChild
                          variant="ghost"
                          size="sm"
                          className="text-xs"
                        >
                          <Link href={`/dashboard/animals/edit?edit=${a.id}`}>
                            Редагувати
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-destructive hover:bg-red-50"
                          onClick={() => handleDelete(a.id)}
                        >
                          Видалити
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
