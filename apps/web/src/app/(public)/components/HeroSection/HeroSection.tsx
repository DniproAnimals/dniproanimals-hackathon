import { HeroCollage } from "./components/HeroCollage";
import { HeroIntro } from "./components/HeroIntro";

export function HeroSection() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 relative z-10">
      <div className="flex flex-col lg:flex-row gap-12 items-center">
        <HeroIntro />
        <HeroCollage />
      </div>
    </div>
  );
}
