import { RequiredRole } from "@/shared/components/RequiredRole";
import { type ReactNode } from "react";

export function DashboardAuthGate({ children }: { children: ReactNode }) {
  return (
    <RequiredRole roles={["admin", "superadmin", "volunteer"]}>
      {children}
    </RequiredRole>
  );
}
