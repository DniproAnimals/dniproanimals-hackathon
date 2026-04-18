import { IconChevronLeft } from "@dniproanimals/icons";
import { Button } from "@dniproanimals/ui";
import Link from "next/link";

export function OrganizationBackButton() {
  return (
    <Button variant="ghost" size="sm" asChild className="mb-6 -ml-3">
      <Link
        href="/organizations"
        className="inline-flex items-center gap-1.5 text-gray-medium hover:text-foreground text-sm"
      >
        <IconChevronLeft size={18} />
        Організації
      </Link>
    </Button>
  );
}
