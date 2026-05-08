import { RequiredRole } from "@/shared/components/RequiredRole";

export default function SuperAdminPage() {
  return (
    <RequiredRole roles={["superadmin"]}>
      <div className="max-w-4xl mx-auto px-6 py-6 pb-24 md:pb-6">
        <h1 className="text-2xl font-bold mb-1">Суперадмін</h1>
      </div>
    </RequiredRole>
  );
}
