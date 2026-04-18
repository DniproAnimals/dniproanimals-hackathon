"use client";
import { VolunteerStatusTabs } from "./components/VolunteerStatusTabs";
import { VolunteersSearchField } from "./components/VolunteersSearchField";

export function VolunteersFilters() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex-1 min-w-50">
        <VolunteersSearchField />
      </div>
      <VolunteerStatusTabs />
    </div>
  );
}
