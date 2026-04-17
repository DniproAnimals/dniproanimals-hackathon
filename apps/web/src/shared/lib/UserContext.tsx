"use client";
import { useMeQuery } from "@/shared/query-hooks";
import type { AuthUserResponse } from "@dniproanimals/contracts";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type UserContextType = {
  user: AuthUserResponse | null;
  loading: boolean;
  favoriteIds: number[];
  refresh: () => Promise<unknown>;
  toggleFavorite: (animalId: number) => Promise<void>;
};

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  favoriteIds: [],
  refresh: async () => {},
  toggleFavorite: async () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading, refetch } = useMeQuery();
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  useEffect(() => {
    if (!user) {
      setFavoriteIds([]);
      return;
    }
    fetch("/api/favorites")
      .then((r) => r.json())
      .then((favs) => {
        if (Array.isArray(favs)) {
          setFavoriteIds(favs.map((f: { id: number }) => f.id));
        }
      })
      .catch(() => {});
  }, [user]);

  const toggleFavorite = useCallback(
    async (animalId: number) => {
      if (!user) return;
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ animal_id: animalId }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.favorited) {
          setFavoriteIds((prev) => [...prev, animalId]);
        } else {
          setFavoriteIds((prev) => prev.filter((id) => id !== animalId));
        }
      }
    },
    [user],
  );

  return (
    <UserContext.Provider
      value={{
        user: user ?? null,
        loading: isLoading,
        favoriteIds,
        refresh: refetch,
        toggleFavorite,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
