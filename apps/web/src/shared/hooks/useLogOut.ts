import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useLogoutMutation } from "../query-hooks";

export const useLogOut = () => {
  const router = useRouter();
  const logoutMutation = useLogoutMutation({
    onSuccess: () => {
      router.push("/");
    },
  });

  const handleLogout = useCallback(() => logoutMutation.mutate(undefined), []);

  return handleLogout;
};
