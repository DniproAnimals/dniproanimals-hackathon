import { DonateBackground } from "./components/DonateBackground";
import { DonateBankDetails } from "./components/DonateBankDetails";
import { DonateContact } from "./components/DonateContact";
import { DonateForm } from "./components/DonateForm";
import { DonateHero } from "./components/DonateHero";
import SheltersNeeds from "./components/ShelterNeedsSection/ShelterNeedsSection";

export default function DonatePage() {
  return (
    <div className="min-h-screen bg-[#Fcfcfc] text-foreground selection:bg-primary selection:text-primary-foreground relative z-0">
      <DonateBackground />
      <div className="max-w-7xl mx-auto px-6 py-6 lg:py-12 relative z-10">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center justify-between mb-16">
          <DonateHero />
          <DonateForm />
        </div>
        <DonateBankDetails />
        <SheltersNeeds />
        <DonateContact />
      </div>
    </div>
  );
}
