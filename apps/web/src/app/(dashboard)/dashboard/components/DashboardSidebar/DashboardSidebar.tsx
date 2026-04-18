"use client";
import { useCurrentOrg } from "@/shared/query-hooks";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@dniproanimals/ui";
import { useState } from "react";
import { SidebarLogo } from "./components/SidebarLogo";
import { SidebarNav } from "./components/SidebarNav";
import { SidebarOrgInfo } from "./components/SidebarOrgInfo";
import { SidebarUserPanel } from "./components/SidebarUserPanel";

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { user, org, isOwner } = useCurrentOrg();

  return (
    <>
      <SidebarLogo />
      {org && <SidebarOrgInfo org={org} />}
      <SidebarNav isOwner={isOwner} onNavigate={onNavigate} />
      {user && <SidebarUserPanel user={user} />}
    </>
  );
}

export function DashboardSidebar() {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <aside className="hidden md:flex sticky top-0 left-0 h-screen w-64 bg-white border-r border-gray-border flex-col">
        <SidebarContent />
      </aside>

      <Sheet open={isOpen} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          className="w-64 p-0 flex flex-col md:hidden"
          hideClose
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Навігація</SheetTitle>
            <SheetDescription>Меню розділів дашборду</SheetDescription>
          </SheetHeader>
          <SidebarContent onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </>
  );
}
