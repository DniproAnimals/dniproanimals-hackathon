"use client";
import { useMeQuery } from "@/shared/query-hooks";
import { Avatar, AvatarFallback, AvatarImage, Badge } from "@dniproanimals/ui";
import { LogoutButton } from "./components/LogoutButton";

export function UserInformation() {
  const { data: user } = useMeQuery();

  return (
    <div className="flex items-center gap-4 mb-8">
      <Avatar className="size-16 shrink-0">
        {user?.photo && <AvatarImage src={user.photo} alt={user.name} />}
        <AvatarFallback className="text-2xl font-bold">
          {user?.name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <h1 className="text-2xl font-bold">{user?.name}</h1>
        <p className="text-sm text-gray-medium">{user?.email}</p>
        {user?.role === "admin" && (
          <Badge variant="danger" size="sm" className="mt-1 uppercase">
            Admin
          </Badge>
        )}
      </div>
      <LogoutButton />
    </div>
  );
}
