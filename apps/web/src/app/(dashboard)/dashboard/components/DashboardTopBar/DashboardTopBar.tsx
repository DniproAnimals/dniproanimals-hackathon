"use client";
import { useCurrentOrg } from "@/shared/query-hooks";
import { IconMenu2 } from "@dniproanimals/icons";
import { Button } from "@dniproanimals/ui";
import { useState } from "react";

export function DashboardTopBar() {
  const { org } = useCurrentOrg();
  const [, setOpen] = useState(false);

  return (
    <div className="md:hidden bg-white border-b border-gray-border px-4 py-3 flex items-center gap-3 sticky top-0 z-30">
      <Button variant="ghost" size="icon-sm" onClick={() => setOpen(true)}>
        <IconMenu2 size={20} />
      </Button>
      <span className="font-semibold text-sm text-foreground">
        {org?.name || "Організація"}
      </span>
    </div>
  );
}
