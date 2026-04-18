import { ImageFallback } from "@/shared/components/ImageFallback";
import type { AnimalOrgRef } from "@dniproanimals/contracts";
import { IconBuildingCommunity, IconChevronRight } from "@dniproanimals/icons";
import Link from "next/link";

export function AnimalOrgCard({ org }: { org: AnimalOrgRef }) {
  return (
    <div className="mb-6">
      <h2 className="text-sm font-semibold mb-3">Організація</h2>
      <Link
        href={`/organizations/${org.id}`}
        className="flex items-center gap-3 p-3 rounded-xl border border-gray-border hover:border-primary hover:bg-primary/5 transition-colors"
      >
        {org.photo ? (
          <ImageFallback
            src={org.photo}
            alt={org.name}
            width={40}
            height={40}
            className="size-10 rounded-lg object-cover shrink-0"
          />
        ) : (
          <div className="size-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
            <IconBuildingCommunity size={18} className="text-green-secondary" />
          </div>
        )}
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">
            {org.name}
          </p>
          {org.location && (
            <p className="text-xs text-gray-medium truncate">{org.location}</p>
          )}
        </div>
        <IconChevronRight
          size={16}
          className="text-gray-400 ml-auto shrink-0"
        />
      </Link>
    </div>
  );
}
