import { RequiredRole } from "@/shared/components/RequiredRole";
import { AdminHeader } from "../components/AdminHeader";
import { ContractEditorPage } from "./ContractEditorPage";

export default function Page() {
  return (
    <RequiredRole roles={["superadmin"]}>
      <AdminHeader />

      <div className="mx-auto max-w-5xl py-10">
        <ContractEditorPage />
      </div>
    </RequiredRole>
  );
}
