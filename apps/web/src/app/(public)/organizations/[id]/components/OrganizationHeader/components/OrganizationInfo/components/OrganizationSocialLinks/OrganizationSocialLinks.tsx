import type { Organization } from "@dniproanimals/contracts";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTelegram,
  IconWorldWww,
} from "@dniproanimals/icons";
import { Button } from "@dniproanimals/ui";

interface OrganizationSocialLinksProps {
  organization: Organization;
}

export function OrganizationSocialLinks({
  organization,
}: OrganizationSocialLinksProps) {
  if (
    !organization.instagram &&
    !organization.telegram &&
    !organization.facebook &&
    !organization.website
  ) {
    return null;
  }

  return (
    <div className="flex gap-2 flex-wrap">
      {organization.instagram && (
        <Button variant="subtle" size="md" shape="square" asChild>
          <a
            href={`https://instagram.com/${organization.instagram}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm font-normal hover:bg-primary/20"
          >
            <IconBrandInstagram size={16} className="text-gray-medium" />
            {organization.instagram}
          </a>
        </Button>
      )}
      {organization.telegram && (
        <Button variant="subtle" size="md" shape="square" asChild>
          <a
            href={`https://t.me/${organization.telegram}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm font-normal hover:bg-primary/20"
          >
            <IconBrandTelegram size={16} className="text-gray-medium" />
            {organization.telegram}
          </a>
        </Button>
      )}
      {organization.facebook && (
        <Button variant="subtle" size="md" shape="square" asChild>
          <a
            href={`https://facebook.com/${organization.facebook}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm font-normal hover:bg-primary/20"
          >
            <IconBrandFacebook size={16} className="text-gray-medium" />
            {organization.facebook}
          </a>
        </Button>
      )}
      {organization.website && (
        <Button variant="subtle" size="md" shape="square" asChild>
          <a
            href={organization.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm font-normal hover:bg-primary/20"
          >
            <IconWorldWww size={16} className="text-gray-medium" />
            Вебсайт
          </a>
        </Button>
      )}
    </div>
  );
}
