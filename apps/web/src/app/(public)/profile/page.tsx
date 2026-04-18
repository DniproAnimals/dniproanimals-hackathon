"use client";
import AnimalCard from "@/shared/components/AnimalCard";
import {
  useFavoritesQuery,
  useLogoutMutation,
  useMeQuery,
} from "@/shared/query-hooks";
import { IconHeartFilled } from "@dniproanimals/icons";
import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  EmptyState,
  Skeleton,
} from "@dniproanimals/ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
  const { data: user, isLoading: loading } = useMeQuery();
  const router = useRouter();
  const logoutMutation = useLogoutMutation({
    onSuccess: () => router.push("/"),
  });
  const { data: favorites, isLoading: loadingFavs } = useFavoritesQuery({
    enabled: !!user,
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  const handleLogout = () => logoutMutation.mutate(undefined);

  if (loading || !user) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-20 text-center">
        <Skeleton className="size-16 rounded-full mx-auto" />
      </div>
    );
  }

  const favs = favorites ?? [];

  return (
    <div className="max-w-6xl mx-auto px-6 py-6 pb-24 md:pb-6">
      <div className="flex items-center gap-4 mb-8">
        <Avatar className="size-16 shrink-0">
          <AvatarFallback className="text-2xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-sm text-gray-medium">{user.email}</p>
          {user.role === "admin" && (
            <Badge variant="danger" size="sm" className="mt-1 uppercase">
              Admin
            </Badge>
          )}
        </div>
        <Button
          variant="subtle"
          size="md"
          shape="default"
          onClick={handleLogout}
          className="hover:bg-red-50 hover:text-red-600"
        >
          Вийти
        </Button>
      </div>

      <h2 className="text-xl font-bold mb-4">
        Обрані тварини
        {favs.length > 0 && (
          <span className="ml-2 text-sm font-normal text-gray-medium">
            {favs.length}
          </span>
        )}
      </h2>

      {loadingFavs ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(3)].map((_, i) => (
            <div key={i}>
              <Skeleton className="rounded-2xl aspect-square" />
              <Skeleton className="mt-2.5 h-4 rounded-lg w-2/3" />
            </div>
          ))}
        </div>
      ) : favs.length === 0 ? (
        <EmptyState
          icon={<IconHeartFilled />}
          description="Ви ще не додали тварин до обраного"
          action={
            <Link
              href="/"
              className="text-sm font-medium text-foreground hover:underline"
            >
              Переглянути каталог →
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
          {favs.map((animal, i) => (
            <AnimalCard key={animal.id} animal={animal} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
