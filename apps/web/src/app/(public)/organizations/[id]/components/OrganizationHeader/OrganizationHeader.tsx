import type { Organization } from "@dniproanimals/contracts";
import { OrganizationInfo } from "./components/OrganizationInfo";
import { OrganizationPhoto } from "./components/OrganizationPhoto";

interface OrganizationHeaderProps {
  organization: Organization;
}

export function OrganizationHeader({ organization }: OrganizationHeaderProps) {
  return (
    <div className="md:flex md:gap-8 mb-10">
      <OrganizationPhoto organization={organization} />
      <OrganizationInfo organization={organization} />
    </div>
  );
}
