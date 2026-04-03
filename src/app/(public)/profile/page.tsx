"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AnimalCard from "@/components/AnimalCard";
import { useUser } from "@/lib/UserContext";
import type { Animal } from "@/lib/db";
import { IconHeartFilled } from "@tabler/icons-react";

export default function ProfilePage() {
  const { user, loading, refresh } = useUser();
  const router = useRouter();
  const [favorites, setFavorites] = useState<Animal[]>([]);
  const [loadingFavs, setLoadingFavs] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetch("/api/favorites")
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data)) setFavorites(data);
          setLoadingFavs(false);
        });
    }
  }, [user]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    refresh();
    router.push("/");
  };

  if (loading || !user) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-light animate-pulse mx-auto" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-6 pb-24 md:pb-6">
      {/* Profile header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-[#ced48c] flex items-center justify-center text-2xl font-bold text-foreground flex-shrink-0">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-sm text-gray-medium">{user.email}</p>
          {user.role === "admin" && (
            <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-600 uppercase">Admin</span>
          )}
        </div>
        <button onClick={handleLogout} className="px-4 py-2 rounded-xl text-sm font-medium bg-gray-light hover:bg-red-50 hover:text-red-600 transition-colors">
          Вийти
        </button>
      </div>

      {/* Favorites */}
      <h2 className="text-xl font-bold mb-4">
        Обрані тварини
        {favorites.length > 0 && (
          <span className="ml-2 text-sm font-normal text-gray-medium">{favorites.length}</span>
        )}
      </h2>

      {loadingFavs ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(3)].map((_, i) => (
            <div key={i}>
              <div className="bg-gray-light rounded-2xl animate-pulse aspect-square" />
              <div className="mt-2.5 h-4 bg-gray-light rounded-lg w-2/3" />
            </div>
          ))}
        </div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-gray-light mx-auto flex items-center justify-center mb-3">
            <IconHeartFilled size={24} className="text-gray-400" />
          </div>
          <p className="text-sm text-gray-medium mb-2">Ви ще не додали тварин до обраного</p>
          <a href="/" className="text-sm font-medium text-foreground hover:underline">Переглянути каталог →</a>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
          {favorites.map((animal, i) => (
            <AnimalCard key={animal.id} animal={animal} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
