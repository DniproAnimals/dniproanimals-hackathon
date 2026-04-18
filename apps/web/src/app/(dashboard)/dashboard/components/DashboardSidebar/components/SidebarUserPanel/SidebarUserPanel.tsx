import type { User } from "@dniproanimals/contracts";
import { IconExternalLink } from "@dniproanimals/icons";
import { Button } from "@dniproanimals/ui";
import Link from "next/link";

export function SidebarUserPanel({ user }: { user: User }) {
  const roleLabel = user.role === "admin" ? "Власник" : "Волонтер";

  return (
    <div className="p-4 border-t border-gray-border/60">
      <div className="flex items-center gap-2.5">
        <div className="size-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-foreground shrink-0">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            {user.name}
          </p>
          <p className="text-[10px] text-gray-medium truncate">{roleLabel}</p>
        </div>
        <Button asChild variant="ghost" size="icon-sm" title="На сайт">
          <Link href="/">
            <IconExternalLink size={16} />
          </Link>
        </Button>
      </div>
    </div>
  );
}
