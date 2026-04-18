import { VolunteersFilters } from "./components/VolunteersFilters";
import { VolunteersHeader } from "./components/VolunteersHeader";
import { VolunteersList } from "./components/VolunteersList";
import { VolunteersStats } from "./components/VolunteersStats";

export default function VolunteersPage() {
  return (
    <div className="max-w-5xl space-y-6">
      <VolunteersHeader />
      <VolunteersStats />
      <VolunteersFilters />
      <VolunteersList />
    </div>
  );
}
