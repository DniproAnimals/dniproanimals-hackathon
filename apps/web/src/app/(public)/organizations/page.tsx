import { OrganizationsHero } from "./components/OrganizationsHero";
import { OrganizationsList } from "./components/OrganizationsList";

export default function OrganizationsPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-6 pb-24 md:pb-6">
      <OrganizationsHero />
      <OrganizationsList />
    </div>
  );
}
