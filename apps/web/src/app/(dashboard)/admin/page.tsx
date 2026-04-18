"use client";
import { RequiredRole } from "@/shared/components/RequiredRole";
import { ORG_STATUS_BADGE_VARIANT, ORG_STATUS_LABEL } from "@/shared/constants";
import {
  useMeQuery,
  useSuperadminDeleteOrgMutation,
  useSuperadminOrgsQuery,
  useSuperadminUpdateOrgMutation,
} from "@/shared/query-hooks";
import { Badge, Button, Card, EmptyState, FilterChip } from "@dniproanimals/ui";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function SuperadminPage() {
  const { data: user } = useMeQuery();
  const { data: orgs = [] } = useSuperadminOrgsQuery();
  const updateMutation = useSuperadminUpdateOrgMutation();
  const deleteMutation = useSuperadminDeleteOrgMutation();
  const [filter, setFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");

  const updateStatus = (id: number, status: "approved" | "rejected") => {
    updateMutation.mutate({ id, status });
  };

  const deleteOrg = (id: number) => {
    if (
      !confirm(
        "Видалити організацію? Акаунти власника та волонтерів буде скинуто.",
      )
    )
      return;
    deleteMutation.mutate({ id });
  };

  const filtered =
    filter === "all" ? orgs : orgs.filter((o) => o.status === filter);

  return (
    <RequiredRole roles={["superadmin"]}>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-border">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/">
                <Image
                  src="/logo.jpg"
                  alt="DniproAnimals"
                  width={36}
                  height={36}
                  className="rounded-full object-cover"
                />
              </Link>
              <h1 className="text-lg font-bold text-foreground">
                Глобальна адмін панель
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-medium">{user?.name}</span>
              <Link
                href="/"
                className="text-sm text-gray-medium hover:text-foreground transition-colors"
              >
                На сайт
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              Організації
            </h2>
            <div className="flex gap-1">
              {(["all", "pending", "approved", "rejected"] as const).map(
                (f) => (
                  <FilterChip
                    key={f}
                    variant={filter === f ? "active" : "outline"}
                    size="md"
                    onClick={() => setFilter(f)}
                    count={
                      f === "all"
                        ? orgs.length
                        : orgs.filter((o) => o.status === f).length
                    }
                  >
                    {f === "all" ? "Усі" : ORG_STATUS_LABEL[f]}
                  </FilterChip>
                ),
              )}
            </div>
          </div>

          {filtered.length === 0 ? (
            <Card className="p-10">
              <EmptyState title="Немає організацій" />
            </Card>
          ) : (
            <div className="space-y-3">
              {filtered.map((org) => (
                <Card key={org.id} className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <Link
                      href={`/organizations/${org.id}`}
                      target="_blank"
                      className="flex-1 min-w-0 hover:opacity-75 transition-opacity"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground truncate">
                          {org.name}
                        </h3>
                        <Badge
                          variant={ORG_STATUS_BADGE_VARIANT[org.status]}
                          size="sm"
                        >
                          {ORG_STATUS_LABEL[org.status]}
                        </Badge>
                      </div>
                      {org.description && (
                        <p className="text-sm text-gray-medium line-clamp-2 mb-2">
                          {org.description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-3 text-xs text-gray-medium">
                        {org.location && <span>{org.location}</span>}
                        {org.email && <span>{org.email}</span>}
                        {org.phone && <span>{org.phone}</span>}
                        {org.website && <span>{org.website}</span>}
                        <span>
                          {new Date(org.createdAt).toLocaleDateString("uk-UA")}
                        </span>
                      </div>
                    </Link>

                    <div className="flex gap-2 shrink-0">
                      {org.status === "pending" && (
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => updateStatus(org.id, "approved")}
                          disabled={updateMutation.isPending}
                        >
                          Схвалити
                        </Button>
                      )}
                      {org.status === "approved" && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => updateStatus(org.id, "rejected")}
                          disabled={updateMutation.isPending}
                          className="bg-yellow-500 text-white hover:bg-yellow-600"
                        >
                          Заблокувати
                        </Button>
                      )}
                      {org.status === "rejected" && (
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => updateStatus(org.id, "approved")}
                          disabled={updateMutation.isPending}
                        >
                          Схвалити
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteOrg(org.id)}
                        disabled={deleteMutation.isPending}
                      >
                        {deleteMutation.isPending ? "..." : "Видалити"}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </RequiredRole>
  );
}
