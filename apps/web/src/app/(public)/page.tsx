import { BackgroundPaws } from "./components/BackgroundPaws";
import { ContactsSection } from "./components/ContactsSection";
import { DailyNeedsSection } from "./components/DailyNeedsSection";
import { FounderQuote } from "./components/FounderQuote";
import { HeroSection } from "./components/HeroSection";
import { MissionGrid } from "./components/MissionGrid";
import { StatsCards } from "./components/StatsCards";
import { StorySection } from "./components/StorySection";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#Fcfcfc] text-foreground selection:bg-primary selection:text-foreground relative z-0 pb-24 md:pb-0 overflow-hidden">
      <BackgroundPaws />
      <HeroSection />
      <StatsCards />
      <StorySection />
      <MissionGrid />
      <DailyNeedsSection />
      <FounderQuote />
      <ContactsSection />
    </div>
  );
}
