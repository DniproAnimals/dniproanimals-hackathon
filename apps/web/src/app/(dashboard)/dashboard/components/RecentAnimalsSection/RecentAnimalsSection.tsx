"use client";
import { useAnimalsQuery, useCurrentOrg } from "@/shared/query-hooks";
import { IconPlus } from "@dniproanimals/icons";
import { Button, Card } from "@dniproanimals/ui";
import Link from "next/link";
import { RecentAnimalRow } from "./components/RecentAnimalRow";

export function RecentAnimalsSection() {
  const { org, isOwner } = useCurrentOrg();
  const { data: animals = [] } = useAnimalsQuery(
    { orgId: org?.id, limit: 5 },
    { enabled: !!org?.id },
  );

  return (
    <Card>
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-border/60">
        <h2 className="text-sm font-semibold text-foreground">
          Останні тварини
        </h2>
        <div className="flex items-center gap-2">
          {isOwner && (
            <Button
              asChild
              variant="primary"
              size="sm"
              className="h-7 px-2.5 text-xs"
            >
              <Link href="/dashboard/animals/add">
                <IconPlus size={12} />
                Додати
              </Link>
            </Button>
          )}
          <Link
            href="/dashboard/animals"
            className="text-xs text-gray-medium hover:text-foreground"
          >
            Всі →
          </Link>
        </div>
      </div>
      {animals.length === 0 ? (
        <div className="p-8 text-center text-gray-medium text-sm">
          Ще немає тварин
        </div>
      ) : (
        <div className="divide-y divide-gray-border/40">
          {animals.map((a) => (
            <RecentAnimalRow key={a.id} animal={a} />
          ))}
        </div>
      )}
    </Card>
  );
}
