"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type UserData = {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin" | "volunteer" | "superadmin";
  org_id: number | null;
} | null;

type UserContextType = {
  user: UserData;
  loading: boolean;
  favoriteIds: number[];
  refresh: () => void;
  toggleFavorite: (animalId: number) => Promise<void>;
};

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  favoriteIds: [],
  refresh: () => {},
  toggleFavorite: async () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData>(null);
  const [loading, setLoading] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  const refresh = useCallback(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        setUser(data);
        setLoading(false);
        if (data) {
          fetch("/api/favorites")
            .then((r) => r.json())
            .then((favs) => {
              if (Array.isArray(favs)) {
                setFavoriteIds(favs.map((f: { id: number }) => f.id));
              }
            });
        } else {
          setFavoriteIds([]);
        }
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

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
      value={{ user, loading, favoriteIds, refresh, toggleFavorite }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
