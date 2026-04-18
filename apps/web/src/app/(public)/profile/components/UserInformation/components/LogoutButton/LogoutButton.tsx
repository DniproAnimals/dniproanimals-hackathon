"use client";
import { useLogOut } from "@/shared/hooks/useLogOut";
import { Button } from "@dniproanimals/ui";

export function LogoutButton() {
  const logOut = useLogOut();

  return (
    <Button
      variant="subtle"
      size="md"
      shape="default"
      onClick={logOut}
      className="hover:bg-red-50 hover:text-red-600"
    >
      Вийти
    </Button>
  );
}
