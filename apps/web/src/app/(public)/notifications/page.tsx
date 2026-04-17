"use client";
import { useUser } from "@/shared/lib/UserContext";
import { cn } from "@/shared/lib/utils";
import {
  IconBellFilled,
  IconHeartFilled,
  IconSearch,
} from "@dniproanimals/icons";
import {
  Badge,
  Card,
  EmptyState,
  Skeleton,
  Tabs,
  TabsList,
  TabsTrigger,
} from "@dniproanimals/ui";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NotificationsPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [requests, setRequests] = useState<
    {
      id: number;
      name: string;
      phone: string;
      email: string;
      animal_name: string;
      message: string | null;
      status: string;
      created_at: string;
    }[]
  >([]);
  const [lostItems, setLostItems] = useState<
    {
      id: number;
      title: string;
      type: string;
      contact_name: string;
      created_at: string;
    }[]
  >([]);
  const [tab, setTab] = useState<"all" | "requests" | "lost">("all");

  useEffect(() => {
    if (!loading && (!user || user.role === "user")) router.push("/");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user || user.role === "user") return;
    fetch("/api/adoption")
      .then((r) => r.json())
      .then(setRequests);
    fetch("/api/lost")
      .then((r) => r.json())
      .then(setLostItems);
  }, [user]);

  if (loading || !user)
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <Skeleton className="size-10 rounded-full mx-auto" />
      </div>
    );

  const allItems = [
    ...requests.map((r) => ({
      id: `req-${r.id}`,
      type: "adoption" as const,
      title: `Заявка від ${r.name}`,
      sub: `на ${r.animal_name}`,
      date: r.created_at,
      status: r.status,
      data: r,
    })),
    ...lostItems.map((l) => ({
      id: `lost-${l.id}`,
      type: "lost" as const,
      title: l.title,
      sub: l.contact_name,
      date: l.created_at,
      status: l.type,
      data: l,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filtered =
    tab === "requests"
      ? allItems.filter((i) => i.type === "adoption")
      : tab === "lost"
        ? allItems.filter((i) => i.type === "lost")
        : allItems;

  const badgeVariantFor = (
    item: (typeof allItems)[number],
  ): "warning" | "success" | "danger" => {
    if (item.type === "adoption") {
      if (item.status === "pending") return "warning";
      if (item.status === "approved") return "success";
      return "danger";
    }
    return "danger";
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-6 pb-24 md:pb-6">
      <h1 className="text-2xl font-bold mb-1">Повідомлення</h1>
      <p className="text-sm text-gray-medium mb-5">
        {allItems.length} повідомлень
      </p>

      {/* Tabs */}
      <Tabs
        value={tab}
        onValueChange={(v) => setTab(v as "all" | "requests" | "lost")}
        className="mb-5"
      >
        <TabsList className="bg-transparent p-0 gap-2">
          {[
            { value: "all" as const, label: "Всі" },
            {
              value: "requests" as const,
              label: `Заявки (${requests.length})`,
            },
            {
              value: "lost" as const,
              label: `Загублені (${lostItems.length})`,
            },
          ].map((t) => (
            <TabsTrigger
              key={t.value}
              value={t.value}
              className="rounded-full px-4 py-2 text-sm font-medium bg-gray-light text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {filtered.length === 0 ? (
        <EmptyState icon={<IconBellFilled />} description="Немає повідомлень" />
      ) : (
        <div className="space-y-2">
          {filtered.map((item) => (
            <Card
              key={item.id}
              className="bg-white p-4 hover:border-primary transition-colors"
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "size-9 rounded-full flex items-center justify-center shrink-0",
                    item.type === "adoption" ? "bg-green-light" : "bg-red-50",
                  )}
                >
                  {item.type === "adoption" ? (
                    <IconHeartFilled size={16} className="text-primary" />
                  ) : (
                    <IconSearch size={16} className="text-red-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-semibold truncate">
                      {item.title}
                    </p>
                    <Badge
                      variant={badgeVariantFor(item)}
                      size="sm"
                      className="shrink-0"
                    >
                      {item.type === "adoption"
                        ? item.status === "pending"
                          ? "Очікує"
                          : item.status === "approved"
                            ? "Схвалено"
                            : "Відхилено"
                        : "Загублено"}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-medium">{item.sub}</p>
                  <p className="text-[10px] text-gray-400 mt-1">
                    {new Date(item.date).toLocaleDateString("uk-UA")} ·{" "}
                    {new Date(item.date).toLocaleTimeString("uk-UA", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  {item.type === "adoption" && (
                    <div className="mt-2 text-xs text-gray-600 space-y-0.5">
                      <p>
                        📧 {(item.data as (typeof requests)[0]).email} · 📞{" "}
                        {(item.data as (typeof requests)[0]).phone}
                      </p>
                      {(item.data as (typeof requests)[0]).message && (
                        <p className="bg-gray-light rounded-lg p-2 mt-1">
                          {(item.data as (typeof requests)[0]).message}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
