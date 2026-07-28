"use client";

import { RequiredRole } from "@/shared/components/RequiredRole";
import { Button } from "@dniproanimals/ui";
import Link from "next/link";
import { AdminHeader } from "./components/AdminHeader";

export default function ContractsChangePage() {
  return (
    <RequiredRole roles={["superadmin"]}>
      <AdminHeader />
      <section className="flex flex-col gap-4 items-center max-w-3xl mx-auto px-6 py-10 md:py-14">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Зміна договору
        </h1>
        <Link
          href="/admin/contracts"
          className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
        >
          <Button>Зміна шаблона</Button>
        </Link>
        <p className="mt-2 text-muted-foreground text-sm md:text-base max-w-xl">
          Тут можна змінити текст договору усиновлення. Після внесення змін
          натисніть кнопку «Зберегти», щоб оновити шаблон.
        </p>
      </section>
    </RequiredRole>
  );
}
