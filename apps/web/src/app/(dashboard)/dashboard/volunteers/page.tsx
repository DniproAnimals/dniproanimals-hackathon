"use client";
import { useUpdateUserRoleMutation, useUsersQuery } from "@/shared/query-hooks";
import type { UpdateUserRoleBody } from "@dniproanimals/contracts";
import {
  Avatar,
  AvatarFallback,
  Badge,
  Card,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@dniproanimals/ui";

export default function VolunteersPage() {
  const { data: users = [], isLoading } = useUsersQuery();
  const updateRoleMutation = useUpdateUserRoleMutation();

  const handleRoleChange = (userId: number, role: string) => {
    updateRoleMutation.mutate({
      id: userId,
      role: role as UpdateUserRoleBody["role"],
    });
  };

  if (isLoading) return <div>Завантаження...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">
        Волонтери та команда
      </h1>

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
            {users.map((user) => (
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
                          : user.role === "volunteer"
                            ? "success"
                            : "soft"
                    }
                    size="sm"
                    className="uppercase"
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Select
                    value={user.role}
                    onValueChange={(val) => handleRoleChange(user.id, val)}
                    disabled={updateRoleMutation.isPending}
                  >
                    <SelectTrigger className="w-[140px] ml-auto">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Користувач</SelectItem>
                      <SelectItem value="volunteer">Волонтер</SelectItem>
                      <SelectItem value="admin">Адмін</SelectItem>
                      <SelectItem value="superadmin">Superadmin</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
