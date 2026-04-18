import { OrgStatusChips } from "./components/OrgStatusChips";

export function OrganizationsFilters() {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-semibold text-foreground">Організації</h2>
      <OrgStatusChips />
    </div>
  );
}
