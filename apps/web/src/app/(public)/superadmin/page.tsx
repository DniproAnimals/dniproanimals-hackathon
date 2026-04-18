"use client";
import {
  useMeQuery,
  useOrganizationsQuery,
  useSuperadminDeleteOrgMutation,
  useSuperadminUpdateOrgMutation,
} from "@/shared/query-hooks";
import { Badge, Button, Card, EmptyState } from "@dniproanimals/ui";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SuperAdminPage() {
  const { data: user, isLoading: loading } = useMeQuery();
  const router = useRouter();
  const { data: orgs = [] } = useOrganizationsQuery({
    enabled: user?.role === "superadmin",
  });
  const updateMutation = useSuperadminUpdateOrgMutation();
  const deleteMutation = useSuperadminDeleteOrgMutation();

  useEffect(() => {
    if (!loading && user?.role !== "superadmin") router.push("/");
  }, [user, loading, router]);

  const updateStatus = (id: number, status: "approved" | "rejected") => {
    updateMutation.mutate({ id, status });
  };

  const deleteOrg = (id: number) => {
    if (
      !confirm(
        "Видалити організацію? Це видалить всіх волонтерів та скине роль власника.",
      )
    )
      return;
    deleteMutation.mutate({ id });
  };

  if (loading || user?.role !== "superadmin") return null;

  const statusVariant = (
    status: string,
  ): "warning" | "success" | "danger" | "default" => {
    if (status === "pending") return "warning";
    if (status === "approved") return "success";
    if (status === "rejected") return "danger";
    return "default";
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-6 pb-24 md:pb-6">
      <h1 className="text-2xl font-bold mb-1">Суперадмін</h1>
      <p className="text-sm text-gray-medium mb-6">Модерація організацій</p>

      {orgs.length === 0 ? (
        <EmptyState description="Організацій поки немає" />
      ) : (
        <div className="space-y-3">
          {orgs.map((org) => (
            <Card key={org.id} className="bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{org.name}</h3>
                    <Badge variant={statusVariant(org.status)} size="sm">
                      {org.status === "pending"
                        ? "На модерації"
                        : org.status === "approved"
                          ? "Схвалено"
                          : "Відхилено"}
                    </Badge>
                  </div>
                  {org.location && (
                    <p className="text-xs text-gray-medium mb-1">
                      📍 {org.location}
                    </p>
                  )}
                  {org.description && (
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {org.description}
                    </p>
                  )}
                  <p className="text-[10px] text-gray-400 mt-1">
                    {new Date(org.createdAt).toLocaleDateString("uk-UA")}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {org.status !== "approved" && (
                    <Button
                      size="sm"
                      variant="success"
                      shape="square"
                      onClick={() => updateStatus(org.id, "approved")}
                    >
                      Схвалити
                    </Button>
                  )}
                  {org.status !== "rejected" && (
                    <Button
                      size="sm"
                      variant="destructive"
                      shape="square"
                      onClick={() => updateStatus(org.id, "rejected")}
                    >
                      Відхилити
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="subtle"
                    shape="square"
                    onClick={() => deleteOrg(org.id)}
                  >
                    Видалити
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
