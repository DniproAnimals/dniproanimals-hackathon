"use client";

import { RequiredRole } from "@/shared/components/RequiredRole";
import { useUpdateUserRoleMutation, useUsersQuery } from "@/shared/query-hooks";
import type { UpdateUserRoleBody, User } from "@dniproanimals/contracts";
import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@dniproanimals/ui";
import { useDeferredValue, useState } from "react";

const ROLE_LABELS: Record<User["role"], string> = {
  user: "Користувач",
  admin: "Адміністратор",
  superadmin: "Суперадмін",
};

function UsersManagement() {
  const { data: users = [], isLoading } = useUsersQuery();
  const updateRoleMutation = useUpdateUserRoleMutation();
  const [emailQuery, setEmailQuery] = useState("");
  const deferredEmailQuery = useDeferredValue(emailQuery);
  const normalizedEmailQuery = deferredEmailQuery.trim().toLocaleLowerCase();
  const filteredUsers = normalizedEmailQuery
    ? users.filter((user) =>
        user.email.toLocaleLowerCase().includes(normalizedEmailQuery),
      )
    : users;

  const handleRoleChange = (
    userId: number,
    role: UpdateUserRoleBody["role"],
  ) => {
    updateRoleMutation.mutate({
      id: userId,
      role,
    });
  };

  if (isLoading) return <div>Завантаження...</div>;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Користувачі та команда
        </h1>
        <p className="mt-1 text-sm text-gray-medium">
          Призначайте адміністраторів серед зареєстрованих користувачів.
        </p>
      </div>

      <div className="max-w-md">
        <label htmlFor="user-email-search" className="sr-only">
          Пошук користувача за email
        </label>
        <Input
          id="user-email-search"
          type="search"
          value={emailQuery}
          placeholder="Пошук за email"
          onChange={(event) => setEmailQuery(event.target.value)}
        />
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Користувач</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Роль</TableHead>
              <TableHead className="text-right">Дії</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="flex items-center gap-3">
                  <Avatar className="size-8">
                    <AvatarFallback>
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{user.name}</span>
                </TableCell>
                <TableCell className="text-gray-medium">{user.email}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      user.role === "superadmin"
                        ? "danger"
                        : user.role === "admin"
                          ? "brand"
                          : "soft"
                    }
                    size="sm"
                    className="uppercase"
                  >
                    {ROLE_LABELS[user.role]}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {user.role === "superadmin" ? (
                    <span className="text-sm text-gray-medium">Захищено</span>
                  ) : (
                    <Button
                      size="sm"
                      variant={user.role === "admin" ? "outline" : "primary"}
                      disabled={updateRoleMutation.isPending}
                      onClick={() =>
                        handleRoleChange(
                          user.id,
                          user.role === "admin" ? "user" : "admin",
                        )
                      }
                    >
                      {user.role === "admin"
                        ? "Зняти адміністратора"
                        : "Призначити адміністратором"}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="py-10 text-center text-gray-medium"
                >
                  Користувачів із таким email не знайдено
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

export default function VolunteersPage() {
  return (
    <RequiredRole roles={["superadmin"]}>
      <UsersManagement />
    </RequiredRole>
  );
}
