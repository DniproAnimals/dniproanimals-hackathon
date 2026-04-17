"use client";
import {
  Badge,
  Button,
  Card,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Skeleton,
  Textarea,
} from "@/components/ui";
import { useUser } from "@/shared/lib/UserContext";
import { cn } from "@/shared/lib/utils";
import {
  IconAlertTriangleFilled,
  IconArrowRight,
  IconCircleCheckFilled,
  IconClock,
  IconClockFilled,
  IconFileTextFilled,
  IconPawFilled,
  IconPlus,
  IconUsersGroup,
} from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDashboard } from "./layout";

type Animal = {
  id: number;
  name: string;
  type: string;
  status: string;
  photos: string;
  created_at: string;
};

type Request = {
  id: number;
  name: string;
  animal_name: string;
  status: string;
  created_at: string;
};

type Volunteer = {
  id: number;
  name: string;
  surname: string | null;
  user_id: number | null;
};

export default function DashboardOverview() {
  const { org, isOwner } = useDashboard();
  const { user } = useUser();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showVolunteerModal, setShowVolunteerModal] = useState(false);
  const [volForm, setVolForm] = useState({
    name: "",
    surname: "",
    description: "",
    phone: "",
    email: "",
    instagram: "",
    telegram: "",
  });
  const [volSubmitting, setVolSubmitting] = useState(false);

  useEffect(() => {
    if (!org) return;
    Promise.all([
      fetch(`/api/animals?org_id=${org.id}`).then((r) => r.json()),
      fetch(`/api/adoption?org_id=${org.id}`).then((r) => r.json()),
      fetch("/api/volunteers").then((r) => r.json()),
    ]).then(([a, r, v]) => {
      if (Array.isArray(a)) setAnimals(a);
      if (Array.isArray(r)) setRequests(r);
      if (Array.isArray(v)) setVolunteers(v);
      setLoading(false);
    });
  }, [org]);

  const handleAddVolunteer = async (e: React.FormEvent) => {
    e.preventDefault();
    setVolSubmitting(true);
    const res = await fetch("/api/volunteers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(volForm),
    });
    if (res.ok) {
      const vols = await fetch("/api/volunteers").then((r) => r.json());
      if (Array.isArray(vols)) setVolunteers(vols);
      setVolForm({
        name: "",
        surname: "",
        description: "",
        phone: "",
        email: "",
        instagram: "",
        telegram: "",
      });
      setShowVolunteerModal(false);
    }
    setVolSubmitting(false);
  };

  const pendingRequests = requests.filter((r) => r.status === "pending");
  const availableAnimals = animals.filter((a) => a.status === "available");
  const activeVolunteers = volunteers.filter((v) => v.user_id);
  const recentAnimals = animals.slice(0, 5);
  const recentRequests = requests.slice(0, 5);

  const [now] = useState(() => Date.now());
  const timeAgo = (date: string) => {
    const diff = now - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins} хв тому`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} год тому`;
    const days = Math.floor(hours / 24);
    return `${days} дн тому`;
  };

  const animalStatusVariant = (s: string): "success" | "info" | "warning" =>
    s === "available" ? "success" : s === "adopted" ? "info" : "warning";
  const requestStatusVariant = (s: string): "warning" | "success" | "danger" =>
    s === "pending" ? "warning" : s === "approved" ? "success" : "danger";

  if (loading) {
    return (
      <div className="max-w-5xl space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Вітаємо, {user?.name}!
        </h1>
        <p className="text-sm text-gray-medium mt-1">
          Ось що відбувається у вашій організації
        </p>
      </div>

      {/* Org status alert */}
      {org && org.status === "pending" && (
        <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <IconClockFilled size={20} className="text-yellow-500 shrink-0" />
          <div>
            <p className="text-sm font-medium text-yellow-800">
              Організація на модерації
            </p>
            <p className="text-xs text-yellow-600 mt-0.5">
              Ваша організація очікує перевірки адміністратором. Деякі функції
              можуть бути обмежені.
            </p>
          </div>
        </div>
      )}
      {org && org.status === "rejected" && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
          <IconAlertTriangleFilled
            size={20}
            className="text-destructive shrink-0"
          />
          <div>
            <p className="text-sm font-medium text-red-800">
              Організацію відхилено
            </p>
            <p className="text-xs text-red-600 mt-0.5">
              Зверніться до адміністрації для уточнення причин.
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/dashboard/animals" className="block">
          <Card className="p-4 hover:shadow-sm transition-all group">
            <div className="flex items-center justify-between mb-3">
              <div className="size-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <IconPawFilled size={20} className="text-green-secondary" />
              </div>
              <IconArrowRight
                size={16}
                className="text-gray-medium group-hover:text-foreground transition-colors"
              />
            </div>
            <p className="text-2xl font-bold text-foreground">
              {animals.length}
            </p>
            <p className="text-xs text-gray-medium mt-0.5">Тварин всього</p>
            <p className="text-[10px] text-green-secondary mt-1">
              {availableAnimals.length} шукають дім
            </p>
          </Card>
        </Link>

        <Link href="/dashboard/requests" className="block">
          <Card className="p-4 hover:shadow-sm transition-all group">
            <div className="flex items-center justify-between mb-3">
              <div className="size-10 rounded-xl bg-orange-50 flex items-center justify-center">
                <IconFileTextFilled size={20} className="text-orange-500" />
              </div>
              <IconArrowRight
                size={16}
                className="text-gray-medium group-hover:text-foreground transition-colors"
              />
            </div>
            <p className="text-2xl font-bold text-foreground">
              {requests.length}
            </p>
            <p className="text-xs text-gray-medium mt-0.5">Анкет всього</p>
            {pendingRequests.length > 0 && (
              <p className="text-[10px] text-orange-500 mt-1 font-medium">
                {pendingRequests.length} очікують розгляду
              </p>
            )}
          </Card>
        </Link>

        <Link href="/dashboard/volunteers" className="block">
          <Card className="p-4 hover:shadow-sm transition-all group">
            <div className="flex items-center justify-between mb-3">
              <div className="size-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <IconUsersGroup size={20} className="text-blue-500" />
              </div>
              <IconArrowRight
                size={16}
                className="text-gray-medium group-hover:text-foreground transition-colors"
              />
            </div>
            <p className="text-2xl font-bold text-foreground">
              {volunteers.length}
            </p>
            <p className="text-xs text-gray-medium mt-0.5">Волонтерів</p>
            <p className="text-[10px] text-blue-500 mt-1">
              {activeVolunteers.length} активних
            </p>
          </Card>
        </Link>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="size-10 rounded-xl bg-green-50 flex items-center justify-center">
              <IconCircleCheckFilled size={20} className="text-green-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {requests.filter((r) => r.status === "approved").length}
          </p>
          <p className="text-xs text-gray-medium mt-0.5">Успішних усиновлень</p>
        </Card>
      </div>

      {/* Two columns: recent animals + recent requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent animals */}
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
                  <Link href="/dashboard/animals">
                    <IconPlus size={12} />
                    Додати
                  </Link>
                </Button>
              )}
              <Link
                href="/dashboard/animals"
                className="text-xs text-gray-medium hover:text-foreground transition-colors"
              >
                Всі →
              </Link>
            </div>
          </div>
          {recentAnimals.length === 0 ? (
            <div className="p-8 text-center text-gray-medium text-sm">
              Ще немає тварин
            </div>
          ) : (
            <div className="divide-y divide-gray-border/40">
              {recentAnimals.map((a) => (
                <div key={a.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center text-xs shrink-0">
                    {a.type === "dog" ? "🐕" : a.type === "cat" ? "🐈" : "🐾"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {a.name}
                    </p>
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-medium">
                      <IconClock size={10} />
                      {timeAgo(a.created_at)}
                    </div>
                  </div>
                  <Badge variant={animalStatusVariant(a.status)} size="sm">
                    {a.status === "available"
                      ? "Шукає дім"
                      : a.status === "adopted"
                        ? "Усиновлено"
                        : "Заброньовано"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Recent requests */}
        <Card>
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-border/60">
            <h2 className="text-sm font-semibold text-foreground">
              Останні анкети
            </h2>
            <Link
              href="/dashboard/requests"
              className="text-xs text-gray-medium hover:text-foreground transition-colors"
            >
              Всі →
            </Link>
          </div>
          {recentRequests.length === 0 ? (
            <div className="p-8 text-center text-gray-medium text-sm">
              Ще немає анкет
            </div>
          ) : (
            <div className="divide-y divide-gray-border/40">
              {recentRequests.map((r) => (
                <div key={r.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="size-8 rounded-full bg-orange-50 flex items-center justify-center text-xs font-bold text-orange-500 shrink-0">
                    {r.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {r.name}
                    </p>
                    <p className="text-[10px] text-gray-medium truncate">
                      хоче усиновити{" "}
                      <span className="text-foreground">{r.animal_name}</span>
                    </p>
                  </div>
                  <Badge variant={requestStatusVariant(r.status)} size="sm">
                    {r.status === "pending"
                      ? "Очікує"
                      : r.status === "approved"
                        ? "Схвалено"
                        : "Відхилено"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Volunteers overview */}
      {volunteers.length > 0 && (
        <Card>
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-border/60">
            <h2 className="text-sm font-semibold text-foreground">Команда</h2>
            <div className="flex items-center gap-2">
              {isOwner && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2.5 text-xs"
                  onClick={() => setShowVolunteerModal(true)}
                >
                  <IconPlus size={12} />
                  Додати
                </Button>
              )}
              <Link
                href="/dashboard/volunteers"
                className="text-xs text-gray-medium hover:text-foreground transition-colors"
              >
                Всі →
              </Link>
            </div>
          </div>
          <div className="px-5 py-4 flex flex-wrap gap-3">
            {volunteers.slice(0, 8).map((v) => (
              <div
                key={v.id}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted border border-gray-border/40"
              >
                <div
                  className={cn(
                    "size-6 rounded-full flex items-center justify-center text-[10px] font-bold",
                    v.user_id
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-medium",
                  )}
                >
                  {v.name.charAt(0)}
                </div>
                <span className="text-xs font-medium text-foreground">
                  {v.name}
                  {v.surname ? ` ${v.surname.charAt(0)}.` : ""}
                </span>
              </div>
            ))}
            {volunteers.length > 8 && (
              <span className="flex items-center px-3 py-1.5 text-xs text-gray-medium">
                +{volunteers.length - 8} ще
              </span>
            )}
          </div>
        </Card>
      )}

      {/* Add volunteer modal */}
      <Dialog open={showVolunteerModal} onOpenChange={setShowVolunteerModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Додати волонтера</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddVolunteer} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-medium mb-1">Ім&#39;я *</p>
                <Input
                  type="text"
                  required
                  value={volForm.name}
                  onChange={(e) =>
                    setVolForm({ ...volForm, name: e.target.value })
                  }
                  placeholder="Ім'я"
                />
              </div>
              <div>
                <p className="text-xs text-gray-medium mb-1">Прізвище</p>
                <Input
                  type="text"
                  value={volForm.surname}
                  onChange={(e) =>
                    setVolForm({ ...volForm, surname: e.target.value })
                  }
                  placeholder="Прізвище"
                />
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-medium mb-1">Опис</p>
              <Textarea
                value={volForm.description}
                onChange={(e) =>
                  setVolForm({ ...volForm, description: e.target.value })
                }
                rows={2}
                placeholder="Чим займається"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-medium mb-1">Телефон</p>
                <Input
                  type="tel"
                  value={volForm.phone}
                  onChange={(e) =>
                    setVolForm({ ...volForm, phone: e.target.value })
                  }
                  placeholder="+380..."
                />
              </div>
              <div>
                <p className="text-xs text-gray-medium mb-1">Email</p>
                <Input
                  type="email"
                  value={volForm.email}
                  onChange={(e) =>
                    setVolForm({ ...volForm, email: e.target.value })
                  }
                  placeholder="email@example.com"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-medium mb-1">Instagram</p>
                <Input
                  type="text"
                  value={volForm.instagram}
                  onChange={(e) =>
                    setVolForm({ ...volForm, instagram: e.target.value })
                  }
                  placeholder="@username"
                />
              </div>
              <div>
                <p className="text-xs text-gray-medium mb-1">Telegram</p>
                <Input
                  type="text"
                  value={volForm.telegram}
                  onChange={(e) =>
                    setVolForm({ ...volForm, telegram: e.target.value })
                  }
                  placeholder="@username"
                />
              </div>
            </div>
            <Button
              type="submit"
              variant="primary"
              disabled={volSubmitting}
              className="w-full"
            >
              {volSubmitting ? "Зачекайте..." : "Додати волонтера"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
