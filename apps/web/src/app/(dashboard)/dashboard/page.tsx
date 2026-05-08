import { DashboardOverviewHeader } from "./components/DashboardOverviewHeader";
import { OverviewStats } from "./components/OverviewStats";
import { RecentAnimalsSection } from "./components/RecentAnimalsSection";
import { RecentRequestsSection } from "./components/RecentRequestsSection";

export default function DashboardOverview() {
  return (
    <div className="max-w-5xl space-y-6">
      <DashboardOverviewHeader />
      <OverviewStats />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RecentAnimalsSection />
        <RecentRequestsSection />
      </div>
    </div>
  );
}
