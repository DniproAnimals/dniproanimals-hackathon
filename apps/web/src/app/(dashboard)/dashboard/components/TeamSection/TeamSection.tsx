"use client";
import { useCurrentOrg, useVolunteersQuery } from "@/shared/query-hooks";
import { IconPlus } from "@dniproanimals/icons";
import { Button, Card } from "@dniproanimals/ui";
import Link from "next/link";
import { useState } from "react";
import { VolunteerFormDialog } from "../../volunteers/components/VolunteerFormDialog";
import { TeamMemberChip } from "./components/TeamMemberChip";

export function TeamSection() {
  const { isOwner } = useCurrentOrg();
  const { data: volunteers = [] } = useVolunteersQuery({ limit: 8 });
  const [createOpen, setCreateOpen] = useState(false);

  if (volunteers.length === 0) return null;

  return (
    <>
      <Card>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-border/60">
          <h2 className="text-sm font-semibold text-foreground">Команда</h2>
          <div className="flex items-center gap-2">
            {isOwner && (
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2.5 text-xs"
                onClick={() => setCreateOpen(true)}
              >
                <IconPlus size={12} />
                Додати
              </Button>
            )}
            <Link
              href="/dashboard/volunteers"
              className="text-xs text-gray-medium hover:text-foreground"
            >
              Всі →
            </Link>
          </div>
        </div>
        <div className="px-5 py-4 flex flex-wrap gap-3">
          {volunteers.map((v) => (
            <TeamMemberChip key={v.id} volunteer={v} />
          ))}
        </div>
      </Card>
      <VolunteerFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        volunteer={null}
        onClose={() => setCreateOpen(false)}
      />
    </>
  );
}
