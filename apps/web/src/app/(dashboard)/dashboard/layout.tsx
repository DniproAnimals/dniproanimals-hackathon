import { DashboardAuthGate } from "./components/DashboardAuthGate";
import { DashboardSidebar } from "./components/DashboardSidebar";
import { DashboardTopBar } from "./components/DashboardTopBar";

export default function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  return (
    <DashboardAuthGate>
      <div className="min-h-screen bg-gray-50 flex">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          <DashboardTopBar />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </DashboardAuthGate>
  );
}
