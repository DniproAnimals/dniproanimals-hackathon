"use client";
import { useCurrentOrg } from "@/shared/query-hooks";
import { DonationsHeader } from "./components/DonationsHeader";
import { MonobankJarSection } from "./components/MonobankJarSection";
import { NotOwnerMessage } from "./components/NotOwnerMessage";
import { OtherMethodsSection } from "./components/OtherMethodsSection";
import { ShareDonateLinkSection } from "./components/ShareDonateLinkSection";

export default function DonationsPage() {
  const { isOwner } = useCurrentOrg();
  if (!isOwner) return <NotOwnerMessage />;
  return (
    <div className="max-w-2xl">
      <DonationsHeader />
      <MonobankJarSection />
      <OtherMethodsSection />
      <ShareDonateLinkSection />
    </div>
  );
}
