import { RequiredRole } from "@/shared/components/RequiredRole";
import { AdminHeader } from "./components/AdminHeader";

export default function SuperadminPage() {
  return (
    <RequiredRole roles={["superadmin"]}>
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        <div className="max-w-5xl mx-auto px-6 py-8"></div>
      </div>
    </RequiredRole>
  );
}
