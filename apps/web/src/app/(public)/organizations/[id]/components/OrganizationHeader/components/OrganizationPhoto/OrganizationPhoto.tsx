import { ImageFallback } from "@/shared/components/ImageFallback";
import type { Organization } from "@dniproanimals/contracts";
import { IconShieldCheckFilled } from "@dniproanimals/icons";
import { Badge } from "@dniproanimals/ui";

interface OrganizationPhotoProps {
  organization: Organization;
}

export function OrganizationPhoto({ organization }: OrganizationPhotoProps) {
  return (
    <div className="md:w-80 shrink-0 mb-6 md:mb-0">
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-light">
        {organization.photo ? (
          <ImageFallback
            src={organization.photo}
            alt={organization.name}
            fill
            className="object-cover"
            sizes="320px"
          />
        ) : (
          <div className="size-full flex items-center justify-center text-6xl text-gray-300">
            🏠
          </div>
        )}
        {organization.status === "approved" && (
          <Badge
            variant="success"
            size="sm"
            className="absolute top-3 right-3 bg-green-500 text-white font-semibold"
          >
            <IconShieldCheckFilled size={12} />
            Перевірено
          </Badge>
        )}
      </div>
    </div>
  );
}
