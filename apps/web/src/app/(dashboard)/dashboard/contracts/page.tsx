import { RequiredRole } from "@/shared/components/RequiredRole";
import { ContractEditorPage } from "./ContractEditorPage";

export default function Page() {
  return (
    <RequiredRole roles={["superadmin"]}>
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-6 text-2xl font-bold text-foreground">
          Шаблон договору
        </h1>
        <ContractEditorPage />
      </div>
    </RequiredRole>
  );
}
