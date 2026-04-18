"use client";
import { useMeQuery } from "@/shared/query-hooks";
import Image from "next/image";
import Link from "next/link";

export function AdminHeader() {
  const { data: user } = useMeQuery();

  return (
    <div className="bg-white border-b border-gray-border">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Image
              src="/logo.jpg"
              alt="DniproAnimals"
              width={36}
              height={36}
              className="rounded-full object-cover"
            />
          </Link>
          <h1 className="text-lg font-bold text-foreground">
            Глобальна адмін панель
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-medium">{user?.name}</span>
          <Link
            href="/"
            className="text-sm text-gray-medium hover:text-foreground transition-colors"
          >
            На сайт
          </Link>
        </div>
      </div>
    </div>
  );
}
