import type { Organization } from "@dniproanimals/contracts";
import { OrganizationContactList } from "./components/OrganizationContactList";
import { OrganizationSocialLinks } from "./components/OrganizationSocialLinks";

interface OrganizationInfoProps {
  organization: Organization;
}

export function OrganizationInfo({ organization }: OrganizationInfoProps) {
  return (
    <div className="flex-1">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">
        {organization.name}
      </h1>

      {organization.description && (
        <p className="text-sm text-gray-600 leading-relaxed mb-5">
          {organization.description}
        </p>
      )}

      <OrganizationContactList organization={organization} />
      <OrganizationSocialLinks organization={organization} />
    </div>
  );
}
