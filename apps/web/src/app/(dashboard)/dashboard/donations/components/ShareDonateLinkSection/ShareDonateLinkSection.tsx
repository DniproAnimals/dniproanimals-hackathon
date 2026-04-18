"use client";
import { useCurrentOrg } from "@/shared/query-hooks";
import { IconExternalLink } from "@dniproanimals/icons";
import { Button, Card } from "@dniproanimals/ui";
import Link from "next/link";
import { CopyLinkButton } from "./components/CopyLinkButton";

export function ShareDonateLinkSection() {
  const { org } = useCurrentOrg();
  if (!org?.monobankJarId) return null;

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const donateUrl = `${origin}/organizations/${org.id}`;

  return (
    <Card className="p-6">
      <h3 className="font-bold text-foreground mb-3">Поділитися</h3>
      <div className="flex items-center gap-2">
        <div className="flex-1 px-4 py-2.5 rounded-xl bg-gray-light border border-gray-border text-sm text-foreground truncate">
          {donateUrl}
        </div>
        <CopyLinkButton text={donateUrl} />
      </div>
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="mt-3 text-green-secondary hover:bg-transparent hover:underline"
      >
        <Link
          href={`/organizations/${org.id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <IconExternalLink size={14} />
          Переглянути сторінку організації
        </Link>
      </Button>
    </Card>
  );
}
